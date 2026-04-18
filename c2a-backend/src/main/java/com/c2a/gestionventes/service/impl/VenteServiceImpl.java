package com.c2a.gestionventes.service.impl;

import com.c2a.gestionventes.dto.BusinessDTOs.*;
import com.c2a.gestionventes.entity.*;
import com.c2a.gestionventes.enums.*;
import com.c2a.gestionventes.exception.BusinessException;
import com.c2a.gestionventes.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

// ===========================
// COMMANDE SERVICE
// ===========================
@Service("commandeService")
@RequiredArgsConstructor
public class CommandeServiceImpl {

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final UserRepository userRepository;

    public List<CommandeResponse> findAll() {
        return commandeRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public CommandeResponse findById(Long id) {
        return toResponse(commandeRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Commande non trouvée: " + id)));
    }

    public List<CommandeResponse> findBySite(String site) {
        return commandeRepository.findBySite(site).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<CommandeResponse> findByStatut(StatutCommande statut) {
        return commandeRepository.findByStatut(statut).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public CommandeResponse create(CommandeRequest req) {
        Client client = clientRepository.findById(req.getClientId())
            .orElseThrow(() -> new EntityNotFoundException("Client non trouvé"));

        Commande commande = Commande.builder()
            .numero(genererNumero()).client(client)
            .remiseGlobale(req.getRemiseGlobale()).tva(req.getTva())
            .site(req.getSite() != null ? req.getSite() : client.getSite())
            .adresseLivraison(req.getAdresseLivraison())
            .observations(req.getObservations())
            .conditionsPaiement(req.getConditionsPaiement())
            .dateLivraisonPrevue(req.getDateLivraisonPrevue())
            .build();

        if (req.getCommercialId() != null)
            commande.setCommercial(userRepository.findById(req.getCommercialId()).orElse(null));

        List<LigneCommande> lignes = req.getLignes().stream().map(lr -> {
            Produit p = produitRepository.findById(lr.getProduitId())
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé: " + lr.getProduitId()));
            LigneCommande lc = LigneCommande.builder()
                .commande(commande).produit(p).quantite(lr.getQuantite())
                .prixUnitaire(lr.getPrixUnitaire()).remise(lr.getRemise()).build();
            lc.calculer();
            return lc;
        }).collect(Collectors.toList());

        commande.setLignes(lignes);
        commande.calculerMontants();
        return toResponse(commandeRepository.save(commande));
    }

    @Transactional
    public CommandeResponse changerStatut(Long id, StatutCommande statut) {
        Commande commande = commandeRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Commande non trouvée: " + id));
        commande.setStatut(statut);
        return toResponse(commandeRepository.save(commande));
    }

    private String genererNumero() {
        String prefix = "CMD-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM")) + "-";
        String last = commandeRepository.findLastNumero(prefix);
        int next = (last != null) ? Integer.parseInt(last.replace(prefix, "")) + 1 : 1;
        return prefix + String.format("%04d", next);
    }

    CommandeResponse toResponse(Commande c) {
        CommandeResponse r = new CommandeResponse();
        r.setId(c.getId()); r.setNumero(c.getNumero()); r.setStatut(c.getStatut());
        r.setRemiseGlobale(c.getRemiseGlobale()); r.setMontantHT(c.getMontantHT());
        r.setTva(c.getTva()); r.setMontantTTC(c.getMontantTTC());
        r.setSite(c.getSite()); r.setAdresseLivraison(c.getAdresseLivraison());
        r.setObservations(c.getObservations());
        r.setDateCommande(c.getDateCommande()); r.setDateLivraisonPrevue(c.getDateLivraisonPrevue());
        if (c.getClient() != null) {
            ClientResponse cr = new ClientResponse();
            cr.setId(c.getClient().getId()); cr.setNom(c.getClient().getNom());
            cr.setTelephone(c.getClient().getTelephone()); cr.setSite(c.getClient().getSite());
            r.setClient(cr);
        }
        if (c.getCommercial() != null)
            r.setCommercialNom(c.getCommercial().getNom() + " " + c.getCommercial().getPrenom());
        if (c.getLignes() != null) {
            r.setLignes(c.getLignes().stream().map(l -> {
                LigneResponse lr = new LigneResponse();
                lr.setId(l.getId()); lr.setProduitId(l.getProduit().getId());
                lr.setProduitDesignation(l.getProduit().getDesignation());
                lr.setProduitReference(l.getProduit().getReference());
                lr.setProduitUnite(l.getProduit().getUnite());
                lr.setQuantite(l.getQuantite()); lr.setPrixUnitaire(l.getPrixUnitaire());
                lr.setRemise(l.getRemise()); lr.setMontantLigne(l.getMontantLigne());
                return lr;
            }).collect(Collectors.toList()));
        }
        return r;
    }
}

// ===========================
// FACTURE SERVICE
// ===========================
@Service("factureService")
@RequiredArgsConstructor
class FactureServiceImpl {

    private final FactureRepository factureRepository;
    private final CommandeRepository commandeRepository;
    private final PaiementRepository paiementRepository;

    public List<FactureResponse> findAll() {
        return factureRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public FactureResponse findById(Long id) {
        return toResponse(factureRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée: " + id)));
    }

    public List<FactureResponse> findEnRetard() {
        return factureRepository.findEnRetard(LocalDate.now()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public FactureResponse create(FactureRequest req) {
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
    public PaiementResponse enregistrerPaiement(PaiementRequest req) {
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
        return prefix + String.format("%04d", (int)(Math.random() * 9000) + 1000);
    }

    FactureResponse toResponse(Facture f) {
        FactureResponse r = new FactureResponse();
        r.setId(f.getId()); r.setNumero(f.getNumero()); r.setStatut(f.getStatut());
        r.setMontantHT(f.getMontantHT()); r.setTva(f.getTva()); r.setMontantTTC(f.getMontantTTC());
        r.setMontantPaye(f.getMontantPaye()); r.setMontantRestant(f.getMontantRestant());
        r.setConditions(f.getConditions()); r.setDateFacture(f.getDateFacture()); r.setDateEcheance(f.getDateEcheance());
        if (f.getPaiements() != null)
            r.setPaiements(f.getPaiements().stream().map(this::toPaiementResponse).collect(Collectors.toList()));
        return r;
    }

    PaiementResponse toPaiementResponse(Paiement p) {
        PaiementResponse r = new PaiementResponse();
        r.setId(p.getId()); r.setFactureId(p.getFacture().getId());
        r.setFactureNumero(p.getFacture().getNumero()); r.setMontant(p.getMontant());
        r.setModePaiement(p.getModePaiement()); r.setStatut(p.getStatut());
        r.setReference(p.getReference()); r.setBanque(p.getBanque());
        r.setDatePaiement(p.getDatePaiement());
        return r;
    }
}

// ===========================
// STOCK SERVICE
// ===========================
@Service("stockService")
@RequiredArgsConstructor
class StockServiceImpl {

    private final ProduitRepository produitRepository;
    private final MouvementStockRepository mouvementStockRepository;
    private final UserRepository userRepository;

    public List<MouvementStockResponse> findByProduit(Long produitId) {
        return mouvementStockRepository.findByProduitIdOrderByDateOperationDesc(produitId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ProduitResponse> getProduitEnRupture() {
        return produitRepository.findEnRupture().stream().map(this::toProduitResponse).collect(Collectors.toList());
    }

    @Transactional
    public MouvementStockResponse enregistrerMouvement(MouvementStockRequest req, Long userId) {
        Produit produit = produitRepository.findById(req.getProduitId())
            .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé: " + req.getProduitId()));

        int stockAvant = produit.getStockActuel();
        int stockApres;

        if (req.getType() == TypeMouvement.ENTREE || req.getType() == TypeMouvement.RETOUR)
            stockApres = stockAvant + req.getQuantite();
        else {
            if (stockAvant < req.getQuantite())
                throw new BusinessException("Stock insuffisant. Disponible: " + stockAvant);
            stockApres = stockAvant - req.getQuantite();
        }

        produit.setStockActuel(stockApres);
        produitRepository.save(produit);

        MouvementStock mouvement = MouvementStock.builder()
            .produit(produit).type(req.getType()).quantite(req.getQuantite())
            .stockAvant(stockAvant).stockApres(stockApres)
            .motif(req.getMotif()).reference(req.getReference())
            .build();

        if (userId != null)
            mouvement.setUtilisateur(userRepository.findById(userId).orElse(null));

        return toResponse(mouvementStockRepository.save(mouvement));
    }

    @Scheduled(cron = "0 0 8 * * *") // Chaque jour à 8h
    public void verifierStocksCritiques() {
        List<Produit> ruptures = produitRepository.findEnRupture();
        ruptures.forEach(p -> System.out.println("[ALERTE] Stock critique: " + p.getDesignation() + " (" + p.getStockActuel() + ")"));
    }

    MouvementStockResponse toResponse(MouvementStock m) {
        MouvementStockResponse r = new MouvementStockResponse();
        r.setId(m.getId()); r.setProduitId(m.getProduit().getId());
        r.setProduitDesignation(m.getProduit().getDesignation());
        r.setType(m.getType()); r.setQuantite(m.getQuantite());
        r.setStockAvant(m.getStockAvant()); r.setStockApres(m.getStockApres());
        r.setMotif(m.getMotif()); r.setReference(m.getReference());
        r.setDateOperation(m.getDateOperation());
        if (m.getUtilisateur() != null)
            r.setUtilisateurNom(m.getUtilisateur().getNom() + " " + m.getUtilisateur().getPrenom());
        return r;
    }

    ProduitResponse toProduitResponse(Produit p) {
        ProduitResponse r = new ProduitResponse();
        r.setId(p.getId()); r.setReference(p.getReference()); r.setDesignation(p.getDesignation());
        r.setCategorie(p.getCategorie()); r.setPrixVente(p.getPrixVente());
        r.setStockActuel(p.getStockActuel()); r.setStockMin(p.getStockMin());
        r.setEnRupture(p.isEnRupture()); r.setUnite(p.getUnite());
        return r;
    }
}
