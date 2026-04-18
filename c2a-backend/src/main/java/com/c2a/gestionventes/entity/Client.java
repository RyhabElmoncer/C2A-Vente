package com.c2a.gestionventes.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "clients")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Client {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String raisonSociale;
    private String matriculeFiscal;

    @Column(nullable = false)
    private String telephone;

    private String email;
    private String adresse;
    private String ville;
    private String codePostal;

    @Column(nullable = false)
    private String site;

    @Column(nullable = false)
    @Builder.Default
    private Double creditMax = 0.0;

    @Builder.Default
    private Double soldeCreance = 0.0;

    @Builder.Default
    private boolean actif = true;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Commande> commandes;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Devis> devis;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
