package com.c2a.gestionventes.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "catalogue_aluminium")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogueAluminium {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String reference;

    @Column(nullable = false)
    private String nom;

    private String categorie;

    private String image;

    private Double largeur;

    private Double hauteur;

    @Column(columnDefinition = "TEXT")
    private String description;
}
