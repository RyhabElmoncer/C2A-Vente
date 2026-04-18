package com.c2a.gestionventes.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "produits")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Produit {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String reference;

    @Column(nullable = false)
    private String designation;

    private String categorie; // ALUMINIUM, INOX, BOIS, MDF, ACCESSOIRE

    @Column(nullable = false)
    private Double prixAchat;

    @Column(nullable = false)
    private Double prixVente;

    private String unite; // ML, M2, KG, PIECE, M3

    @Column(nullable = false)
    @Builder.Default
    private Integer stockActuel = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer stockMin = 5;

    private String emplacement;
    private String description;

    @Builder.Default
    private boolean actif = true;

    @OneToMany(mappedBy = "produit")
    private List<MouvementStock> mouvements;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public boolean isEnRupture() {
        return this.stockActuel <= this.stockMin;
    }
}
