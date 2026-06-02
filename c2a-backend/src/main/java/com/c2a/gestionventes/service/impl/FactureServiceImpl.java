package com.c2a.gestionventes.service.impl;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.entity.Commande;
import com.c2a.gestionventes.entity.Facture;
import com.c2a.gestionventes.entity.Paiement;
import com.c2a.gestionventes.enums.StatutFacture;
import com.c2a.gestionventes.enums.StatutPaiement;
import com.c2a.gestionventes.exception.BusinessException;
import com.c2a.gestionventes.repository.CommandeRepository;
import com.c2a.gestionventes.repository.FactureRepository;
import com.c2a.gestionventes.repository.PaiementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

// ===========================
// FACTURE SERVICE
// ===========================
@Service("factureService")
@RequiredArgsConstructor
public class FactureServiceImpl {

    private final FactureRepository factureRepository;
    private final CommandeRepository commandeRepository;
    private final PaiementRepository paiementRepository;

    public List<BusinessDTOs.FactureResponse> findAll() {
        return factureRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BusinessDTOs.FactureResponse findById(Long id) {
        return toResponse(factureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée: " + id)));
    }

    public List<BusinessDTOs.FactureResponse> findEnRetard() {
        return factureRepository.findEnRetard(LocalDate.now()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public BusinessDTOs.FactureResponse create(BusinessDTOs.FactureRequest req) {
        Commande commande = commandeRepository.findById(req.getCommandeId())
                .orElseThrow(() -> new EntityNotFoundException("Commande non trouvée"));

        Facture facture = Facture.builder()
                .numero(genererNumero())
                .commande(commande)
                .montantHT(commande.getMontantHT())
                .tva(req.getTva())
                .conditions(req.getConditions())
                .observations(req.getObservations())
                .dateEcheance(req.getDateEcheance())
                .build();
        facture.calculerTVA();
        return toResponse(factureRepository.save(facture));
    }

    @Transactional
    public BusinessDTOs.PaiementResponse enregistrerPaiement(BusinessDTOs.PaiementRequest req) {
        Facture facture = factureRepository.findById(req.getFactureId())
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée"));
        if (req.getMontant() > facture.getMontantRestant())
            throw new BusinessException("Montant supérieur au restant dû: " + facture.getMontantRestant());

        Paiement paiement = Paiement.builder()
                .facture(facture).montant(req.getMontant())
                .modePaiement(req.getModePaiement()).reference(req.getReference())
                .banque(req.getBanque()).observations(req.getObservations())
                .datePaiement(req.getDatePaiement() != null ? req.getDatePaiement() : LocalDate.now())
                .statut(StatutPaiement.VALIDE).build();

        facture.setMontantPaye(facture.getMontantPaye() + req.getMontant());
        facture.setMontantRestant(facture.getMontantTTC() - facture.getMontantPaye());
        facture.setStatut(facture.getMontantRestant() <= 0 ? StatutFacture.PAYEE : StatutFacture.PARTIELLEMENT_PAYEE);
        factureRepository.save(facture);

        // Mettre à jour la créance client
        Commande cmd = facture.getCommande();
        cmd.getClient().setSoldeCreance(Math.max(0, cmd.getClient().getSoldeCreance() - req.getMontant()));
        commandeRepository.save(cmd);

        Paiement saved = paiementRepository.save(paiement);
        return toPaiementResponse(saved);
    }

    private String genererNumero() {
        String prefix = "FAC-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM")) + "-";
        return prefix + String.format("%04d", (int) (Math.random() * 9000) + 1000);
    }

    BusinessDTOs.FactureResponse toResponse(Facture f) {
        BusinessDTOs.FactureResponse r = new BusinessDTOs.FactureResponse();
        r.setId(f.getId());
        r.setNumero(f.getNumero());
        r.setStatut(f.getStatut());
        r.setMontantHT(f.getMontantHT());
        r.setTva(f.getTva());
        r.setMontantTTC(f.getMontantTTC());
        r.setMontantPaye(f.getMontantPaye());
        r.setMontantRestant(f.getMontantRestant());
        r.setConditions(f.getConditions());
        r.setDateFacture(f.getDateFacture());
        r.setDateEcheance(f.getDateEcheance());
        if (f.getPaiements() != null)
            r.setPaiements(f.getPaiements().stream().map(this::toPaiementResponse).collect(Collectors.toList()));
        return r;
    }

    BusinessDTOs.PaiementResponse toPaiementResponse(Paiement p) {
        BusinessDTOs.PaiementResponse r = new BusinessDTOs.PaiementResponse();
        r.setId(p.getId());
        r.setFactureId(p.getFacture().getId());
        r.setFactureNumero(p.getFacture().getNumero());
        r.setMontant(p.getMontant());
        r.setModePaiement(p.getModePaiement());
        r.setStatut(p.getStatut());
        r.setReference(p.getReference());
        r.setBanque(p.getBanque());
        r.setDatePaiement(p.getDatePaiement());
        return r;
    }
}
