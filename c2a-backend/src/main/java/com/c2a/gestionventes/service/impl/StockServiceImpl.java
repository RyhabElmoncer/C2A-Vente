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

import java.util.List;
import java.util.stream.Collectors;


@Service("stockService")
@RequiredArgsConstructor
public class StockServiceImpl {

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
