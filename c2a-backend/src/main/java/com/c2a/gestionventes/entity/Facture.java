package com.c2a.gestionventes.entity;

import com.c2a.gestionventes.enums.StatutFacture;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "factures")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Facture {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutFacture statut = StatutFacture.EMISE;

    @Builder.Default
    private Double montantHT = 0.0;

    @Builder.Default
    private Double tva = 19.0;

    @Builder.Default
    private Double montantTTC = 0.0;

    @Builder.Default
    private Double montantPaye = 0.0;

    @Builder.Default
    private Double montantRestant = 0.0;

    private String conditions;
    private String observations;

    private LocalDate dateFacture;
    private LocalDate dateEcheance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL)
    private List<Paiement> paiements;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.dateFacture == null) this.dateFacture = LocalDate.now();
        if (this.dateEcheance == null) this.dateEcheance = LocalDate.now().plusDays(30);
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public void calculerTVA() {
        this.montantTTC = this.montantHT * (1 + this.tva / 100);
        this.montantRestant = this.montantTTC - this.montantPaye;
    }
}
