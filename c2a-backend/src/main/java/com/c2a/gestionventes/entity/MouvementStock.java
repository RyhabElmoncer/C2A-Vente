package com.c2a.gestionventes.entity;

import com.c2a.gestionventes.enums.TypeMouvement;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mouvements_stock")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MouvementStock {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @Enumerated(EnumType.STRING)
    private TypeMouvement type;

    @Column(nullable = false)
    private Integer quantite;

    private Integer stockAvant;
    private Integer stockApres;

    private String motif;
    private String reference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User utilisateur;

    private LocalDateTime dateOperation;

    @PrePersist
    public void prePersist() {
        if (this.dateOperation == null) this.dateOperation = LocalDateTime.now();
    }
}
