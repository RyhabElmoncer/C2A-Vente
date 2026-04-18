package com.c2a.gestionventes.service.impl;

import com.c2a.gestionventes.dto.BusinessDTOs.*;
import com.c2a.gestionventes.entity.*;
import com.c2a.gestionventes.enums.*;
import com.c2a.gestionventes.exception.BusinessException;
import com.c2a.gestionventes.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

// ===========================
// CLIENT SERVICE
// ===========================
@Service
@RequiredArgsConstructor
class ClientServiceImpl {

    private final ClientRepository clientRepository;

    public List<ClientResponse> findAll() {
        return clientRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ClientResponse findById(Long id) {
        return toResponse(clientRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Client non trouvé: " + id)));
    }

    public List<ClientResponse> findBySite(String site) {
        return clientRepository.findBySite(site).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ClientResponse> findAvecCreances() {
        return clientRepository.findClientsAvecCreances().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ClientResponse create(ClientRequest req) {
        Client client = Client.builder()
            .nom(req.getNom()).raisonSociale(req.getRaisonSociale())
            .matriculeFiscal(req.getMatriculeFiscal()).telephone(req.getTelephone())
            .email(req.getEmail()).adresse(req.getAdresse()).ville(req.getVille())
            .codePostal(req.getCodePostal()).site(req.getSite())
            .creditMax(req.getCreditMax() != null ? req.getCreditMax() : 0.0)
            .build();
        return toResponse(clientRepository.save(client));
    }

    @Transactional
    public ClientResponse update(Long id, ClientRequest req) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Client non trouvé: " + id));
        client.setNom(req.getNom()); client.setTelephone(req.getTelephone());
        client.setEmail(req.getEmail()); client.setAdresse(req.getAdresse());
        client.setVille(req.getVille()); client.setSite(req.getSite());
        client.setCreditMax(req.getCreditMax());
        return toResponse(clientRepository.save(client));
    }

    @Transactional
    public void delete(Long id) {
        Client client = clientRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Client non trouvé: " + id));
        client.setActif(false);
        clientRepository.save(client);
    }

    ClientResponse toResponse(Client c) {
        ClientResponse r = new ClientResponse();
        r.setId(c.getId()); r.setNom(c.getNom()); r.setRaisonSociale(c.getRaisonSociale());
        r.setTelephone(c.getTelephone()); r.setEmail(c.getEmail()); r.setAdresse(c.getAdresse());
        r.setVille(c.getVille()); r.setSite(c.getSite());
        r.setCreditMax(c.getCreditMax()); r.setSoldeCreance(c.getSoldeCreance()); r.setActif(c.isActif());
        return r;
    }
}

// ===========================
// PRODUIT SERVICE
// ===========================
@Service
@RequiredArgsConstructor
class ProduitServiceImpl {

    private final ProduitRepository produitRepository;

    public List<ProduitResponse> findAll() {
        return produitRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProduitResponse findById(Long id) {
        return toResponse(produitRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé: " + id)));
    }

    public List<ProduitResponse> findEnRupture() {
        return produitRepository.findEnRupture().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProduitResponse create(ProduitRequest req) {
        if (produitRepository.findByReference(req.getReference()).isPresent())
            throw new BusinessException("Référence déjà existante: " + req.getReference());
        Produit p = Produit.builder()
            .reference(req.getReference()).designation(req.getDesignation())
            .categorie(req.getCategorie()).prixAchat(req.getPrixAchat())
            .prixVente(req.getPrixVente()).unite(req.getUnite())
            .stockActuel(req.getStockActuel()).stockMin(req.getStockMin())
            .emplacement(req.getEmplacement()).description(req.getDescription())
            .build();
        return toResponse(produitRepository.save(p));
    }

    @Transactional
    public ProduitResponse update(Long id, ProduitRequest req) {
        Produit p = produitRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé: " + id));
        p.setDesignation(req.getDesignation()); p.setCategorie(req.getCategorie());
        p.setPrixAchat(req.getPrixAchat()); p.setPrixVente(req.getPrixVente());
        p.setUnite(req.getUnite()); p.setStockMin(req.getStockMin());
        p.setEmplacement(req.getEmplacement());
        return toResponse(produitRepository.save(p));
    }

    ProduitResponse toResponse(Produit p) {
        ProduitResponse r = new ProduitResponse();
        r.setId(p.getId()); r.setReference(p.getReference()); r.setDesignation(p.getDesignation());
        r.setCategorie(p.getCategorie()); r.setPrixAchat(p.getPrixAchat()); r.setPrixVente(p.getPrixVente());
        r.setUnite(p.getUnite()); r.setStockActuel(p.getStockActuel()); r.setStockMin(p.getStockMin());
        r.setEnRupture(p.isEnRupture()); r.setEmplacement(p.getEmplacement()); r.setActif(p.isActif());
        return r;
    }
}

// ===========================
// DEVIS SERVICE
// ===========================
@Service
@RequiredArgsConstructor
class DevisServiceImpl {

    private final DevisRepository devisRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;
    private final CommandeRepository commandeRepository;

    public List<DevisResponse> findAll() {
        return devisRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public DevisResponse findById(Long id) {
        return toResponse(devisRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Devis non trouvé: " + id)));
    }

    @Transactional
    public DevisResponse create(DevisRequest req) {
        Client client = clientRepository.findById(req.getClientId())
            .orElseThrow(() -> new EntityNotFoundException("Client non trouvé"));

        Devis devis = Devis.builder()
            .numero(genererNumeroDevis())
            .client(client)
            .remiseGlobale(req.getRemiseGlobale())
            .tva(req.getTva())
            .observations(req.getObservations())
            .conditionsPaiement(req.getConditionsPaiement())
            .dateValidite(req.getDateValidite())
            .build();

        if (req.getCommercialId() != null)
            devis.setCommercial(userRepository.findById(req.getCommercialId()).orElse(null));

        List<LigneDevis> lignes = req.getLignes().stream().map(lr -> {
            Produit p = produitRepository.findById(lr.getProduitId())
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé: " + lr.getProduitId()));
            LigneDevis ligne = LigneDevis.builder()
                .devis(devis).produit(p).quantite(lr.getQuantite())
                .prixUnitaire(lr.getPrixUnitaire()).remise(lr.getRemise()).build();
            ligne.calculer();
            return ligne;
        }).collect(Collectors.toList());

        devis.setLignes(lignes);
        devis.calculerMontants();
        return toResponse(devisRepository.save(devis));
    }

    @Transactional
    public DevisResponse changerStatut(Long id, StatutDevis statut) {
        Devis devis = devisRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Devis non trouvé: " + id));
        devis.setStatut(statut);
        return toResponse(devisRepository.save(devis));
    }

    @Transactional
    public CommandeResponse convertirEnCommande(Long devisId) {
        Devis devis = devisRepository.findById(devisId)
            .orElseThrow(() -> new EntityNotFoundException("Devis non trouvé"));
        if (devis.getStatut() != StatutDevis.VALIDE)
            throw new BusinessException("Le devis doit être validé avant conversion");

        Commande commande = Commande.builder()
            .numero(genererNumeroCommande())
            .client(devis.getClient())
            .commercial(devis.getCommercial())
            .devisOrigine(devis)
            .remiseGlobale(devis.getRemiseGlobale())
            .tva(devis.getTva())
            .montantHT(devis.getMontantHT())
            .montantTTC(devis.getMontantTTC())
            .site(devis.getClient().getSite())
            .observations(devis.getObservations())
            .build();

        List<LigneCommande> lignesCmd = devis.getLignes().stream().map(ld -> {
            LigneCommande lc = LigneCommande.builder()
                .commande(commande).produit(ld.getProduit())
                .quantite(ld.getQuantite()).prixUnitaire(ld.getPrixUnitaire())
                .remise(ld.getRemise()).montantLigne(ld.getMontantLigne()).build();
            return lc;
        }).collect(Collectors.toList());

        commande.setLignes(lignesCmd);
        devis.setStatut(StatutDevis.CONVERTI);
        devisRepository.save(devis);
        Commande saved = commandeRepository.save(commande);
        return mapCommandeToResponse(saved);
    }

    private String genererNumeroDevis() {
        String prefix = "DEV-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM")) + "-";
        String last = devisRepository.findLastNumero(prefix);
        int next = (last != null) ? Integer.parseInt(last.replace(prefix, "")) + 1 : 1;
        return prefix + String.format("%04d", next);
    }

    private String genererNumeroCommande() {
        String prefix = "CMD-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM")) + "-";
        String last = commandeRepository.findLastNumero(prefix);
        int next = (last != null) ? Integer.parseInt(last.replace(prefix, "")) + 1 : 1;
        return prefix + String.format("%04d", next);
    }

    private CommandeResponse mapCommandeToResponse(Commande c) {
        CommandeResponse r = new CommandeResponse();
        r.setId(c.getId()); r.setNumero(c.getNumero()); r.setStatut(c.getStatut());
        r.setMontantHT(c.getMontantHT()); r.setMontantTTC(c.getMontantTTC());
        r.setSite(c.getSite());
        return r;
    }

    DevisResponse toResponse(Devis d) {
        DevisResponse r = new DevisResponse();
        r.setId(d.getId()); r.setNumero(d.getNumero()); r.setStatut(d.getStatut());
        r.setRemiseGlobale(d.getRemiseGlobale()); r.setMontantHT(d.getMontantHT());
        r.setTva(d.getTva()); r.setMontantTTC(d.getMontantTTC());
        r.setObservations(d.getObservations()); r.setConditionsPaiement(d.getConditionsPaiement());
        r.setDateCreation(d.getDateCreation()); r.setDateValidite(d.getDateValidite());
        if (d.getClient() != null) {
            ClientResponse cr = new ClientResponse();
            cr.setId(d.getClient().getId()); cr.setNom(d.getClient().getNom());
            cr.setSite(d.getClient().getSite());
            r.setClient(cr);
        }
        if (d.getCommercial() != null)
            r.setCommercialNom(d.getCommercial().getNom() + " " + d.getCommercial().getPrenom());
        if (d.getLignes() != null) {
            r.setLignes(d.getLignes().stream().map(l -> {
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
