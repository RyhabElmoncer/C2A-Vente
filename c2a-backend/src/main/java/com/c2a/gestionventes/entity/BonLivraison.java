package com.c2a.gestionventes.entity;

import com.c2a.gestionventes.enums.StatutBonLivraison;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bons_livraison")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BonLivraison {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livreur_id")
    private User livreur;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutBonLivraison statut = StatutBonLivraison.GENERE;

    private String adresseLivraison;
    private String signatureLivreur;
    private String nomReceptionnaire;
    private String observations;

    private LocalDate dateLivraison;
    private LocalDate dateLivraisonEffective;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.dateLivraison == null) this.dateLivraison = LocalDate.now();
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
