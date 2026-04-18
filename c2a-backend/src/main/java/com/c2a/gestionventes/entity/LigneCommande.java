package com.c2a.gestionventes.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lignes_commande")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LigneCommande {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @Column(nullable = false)
    private Double quantite;

    @Column(nullable = false)
    private Double prixUnitaire;

    @Builder.Default
    private Double remise = 0.0;

    @Builder.Default
    private Double montantLigne = 0.0;

    public void calculer() {
        this.montantLigne = this.quantite * this.prixUnitaire * (1 - this.remise / 100);
    }
}
