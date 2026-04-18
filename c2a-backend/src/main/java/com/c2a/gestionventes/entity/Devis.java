package com.c2a.gestionventes.entity;

import com.c2a.gestionventes.enums.StatutDevis;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "devis")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Devis {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commercial_id")
    private User commercial;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutDevis statut = StatutDevis.BROUILLON;

    @Builder.Default
    @OneToMany(mappedBy = "devis", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneDevis> lignes = new ArrayList<>();

    @Builder.Default
    private Double remiseGlobale = 0.0;

    @Builder.Default
    private Double montantHT = 0.0;

    @Builder.Default
    private Double tva = 19.0;

    @Builder.Default
    private Double montantTTC = 0.0;

    private String observations;
    private String conditionsPaiement;

    private LocalDate dateCreation;
    private LocalDate dateValidite;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.dateCreation == null) this.dateCreation = LocalDate.now();
        if (this.dateValidite == null) this.dateValidite = LocalDate.now().plusDays(30);
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public void calculerMontants() {
        this.montantHT = lignes.stream()
            .mapToDouble(LigneDevis::getMontantLigne)
            .sum();
        this.montantHT = this.montantHT * (1 - this.remiseGlobale / 100);
        this.montantTTC = this.montantHT * (1 + this.tva / 100);
    }
}
