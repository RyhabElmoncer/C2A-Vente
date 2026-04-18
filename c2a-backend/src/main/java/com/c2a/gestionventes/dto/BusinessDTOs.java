package com.c2a.gestionventes.dto;

import com.c2a.gestionventes.enums.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

// ===== CLIENT =====
public class BusinessDTOs {

    @Data
    public static class ClientRequest {
        @NotBlank private String nom;
        private String raisonSociale;
        private String matriculeFiscal;
        @NotBlank private String telephone;
        private String email;
        private String adresse;
        private String ville;
        private String codePostal;
        @NotBlank private String site;
        @PositiveOrZero private Double creditMax = 0.0;
    }

    @Data
    public static class ClientResponse {
        private Long id;
        private String nom;
        private String raisonSociale;
        private String telephone;
        private String email;
        private String adresse;
        private String ville;
        private String site;
        private Double creditMax;
        private Double soldeCreance;
        private boolean actif;
    }

    // ===== PRODUIT =====
    @Data
    public static class ProduitRequest {
        @NotBlank private String reference;
        @NotBlank private String designation;
        private String categorie;
        @Positive private Double prixAchat;
        @Positive private Double prixVente;
        private String unite;
        @PositiveOrZero private Integer stockActuel = 0;
        @PositiveOrZero private Integer stockMin = 5;
        private String emplacement;
        private String description;
    }

    @Data
    public static class ProduitResponse {
        private Long id;
        private String reference;
        private String designation;
        private String categorie;
        private Double prixAchat;
        private Double prixVente;
        private String unite;
        private Integer stockActuel;
        private Integer stockMin;
        private boolean enRupture;
        private String emplacement;
        private boolean actif;
    }

    // ===== LIGNE =====
    @Data
    public static class LigneRequest {
        @NotNull private Long produitId;
        @Positive private Double quantite;
        @Positive private Double prixUnitaire;
        @PositiveOrZero @DecimalMax("100") private Double remise = 0.0;
    }

    @Data
    public static class LigneResponse {
        private Long id;
        private Long produitId;
        private String produitDesignation;
        private String produitReference;
        private String produitUnite;
        private Double quantite;
        private Double prixUnitaire;
        private Double remise;
        private Double montantLigne;
    }

    // ===== DEVIS =====
    @Data
    public static class DevisRequest {
        @NotNull private Long clientId;
        private Long commercialId;
        @PositiveOrZero @DecimalMax("100") private Double remiseGlobale = 0.0;
        private Double tva = 19.0;
        private String observations;
        private String conditionsPaiement;
        private LocalDate dateValidite;
        @NotEmpty private List<LigneRequest> lignes;
    }

    @Data
    public static class DevisResponse {
        private Long id;
        private String numero;
        private ClientResponse client;
        private String commercialNom;
        private StatutDevis statut;
        private Double remiseGlobale;
        private Double montantHT;
        private Double tva;
        private Double montantTTC;
        private String observations;
        private String conditionsPaiement;
        private LocalDate dateCreation;
        private LocalDate dateValidite;
        private List<LigneResponse> lignes;
    }

    // ===== COMMANDE =====
    @Data
    public static class CommandeRequest {
        @NotNull private Long clientId;
        private Long commercialId;
        private Long devisId;
        @PositiveOrZero @DecimalMax("100") private Double remiseGlobale = 0.0;
        private Double tva = 19.0;
        private String site;
        private String adresseLivraison;
        private String observations;
        private String conditionsPaiement;
        private LocalDate dateLivraisonPrevue;
        @NotEmpty private List<LigneRequest> lignes;
    }

    @Data
    public static class CommandeResponse {
        private Long id;
        private String numero;
        private ClientResponse client;
        private String commercialNom;
        private StatutCommande statut;
        private Double remiseGlobale;
        private Double montantHT;
        private Double tva;
        private Double montantTTC;
        private String site;
        private String adresseLivraison;
        private String observations;
        private LocalDate dateCommande;
        private LocalDate dateLivraisonPrevue;
        private List<LigneResponse> lignes;
    }

    // ===== BON LIVRAISON =====
    @Data
    public static class BonLivraisonRequest {
        @NotNull private Long commandeId;
        private Long livreurId;
        private String adresseLivraison;
        private String observations;
        private LocalDate dateLivraison;
    }

    @Data
    public static class BonLivraisonResponse {
        private Long id;
        private String numero;
        private CommandeResponse commande;
        private String livreurNom;
        private StatutBonLivraison statut;
        private String adresseLivraison;
        private String signatureLivreur;
        private String nomReceptionnaire;
        private LocalDate dateLivraison;
        private LocalDate dateLivraisonEffective;
    }

    // ===== FACTURE =====
    @Data
    public static class FactureRequest {
        @NotNull private Long commandeId;
        private Double tva = 19.0;
        private String conditions;
        private String observations;
        private LocalDate dateEcheance;
    }

    @Data
    public static class FactureResponse {
        private Long id;
        private String numero;
        private CommandeResponse commande;
        private StatutFacture statut;
        private Double montantHT;
        private Double tva;
        private Double montantTTC;
        private Double montantPaye;
        private Double montantRestant;
        private String conditions;
        private LocalDate dateFacture;
        private LocalDate dateEcheance;
        private List<PaiementResponse> paiements;
    }

    // ===== PAIEMENT =====
    @Data
    public static class PaiementRequest {
        @NotNull private Long factureId;
        @Positive private Double montant;
        private ModePaiement modePaiement;
        private String reference;
        private String banque;
        private String observations;
        private LocalDate datePaiement;
    }

    @Data
    public static class PaiementResponse {
        private Long id;
        private Long factureId;
        private String factureNumero;
        private Double montant;
        private ModePaiement modePaiement;
        private StatutPaiement statut;
        private String reference;
        private String banque;
        private LocalDate datePaiement;
    }

    // ===== STOCK =====
    @Data
    public static class MouvementStockRequest {
        @NotNull private Long produitId;
        private TypeMouvement type;
        @Positive private Integer quantite;
        private String motif;
        private String reference;
    }

    @Data
    public static class MouvementStockResponse {
        private Long id;
        private Long produitId;
        private String produitDesignation;
        private TypeMouvement type;
        private Integer quantite;
        private Integer stockAvant;
        private Integer stockApres;
        private String motif;
        private String reference;
        private String utilisateurNom;
        private java.time.LocalDateTime dateOperation;
    }

    // ===== DASHBOARD =====
    @Data
    public static class DashboardDTO {
        private Double chiffreAffairesMois;
        private Double chiffreAffairesAnnee;
        private Long nombreCommandesMois;
        private Long nombreClientsActifs;
        private Long nombreProduitsRupture;
        private Double totalCreances;
        private Double encaissementsMois;
        private List<TopClientDTO> topClients;
        private List<TopProduitDTO> topProduits;
        private List<VenteParMoisDTO> ventesParMois;
    }

    @Data
    public static class TopClientDTO {
        private String nomClient;
        private Double totalAchats;
        private Long nombreCommandes;
    }

    @Data
    public static class TopProduitDTO {
        private String designation;
        private Double quantiteVendue;
        private Double chiffreAffaires;
    }

    @Data
    public static class VenteParMoisDTO {
        private String mois;
        private Double montant;
        private Long nombreCommandes;
    }
}
