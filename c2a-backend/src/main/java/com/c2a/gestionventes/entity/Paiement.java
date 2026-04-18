package com.c2a.gestionventes.entity;

import com.c2a.gestionventes.enums.ModePaiement;
import com.c2a.gestionventes.enums.StatutPaiement;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiements")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Paiement {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facture_id", nullable = false)
    private Facture facture;

    @Column(nullable = false)
    private Double montant;

    @Enumerated(EnumType.STRING)
    private ModePaiement modePaiement;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutPaiement statut = StatutPaiement.EN_ATTENTE;

    private String reference;
    private String banque;
    private String observations;

    private LocalDate datePaiement;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.datePaiement == null) this.datePaiement = LocalDate.now();
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
