package com.c2a.gestionventes.service.impl;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.entity.Client;
import com.c2a.gestionventes.entity.Commande;
import com.c2a.gestionventes.entity.LigneCommande;
import com.c2a.gestionventes.entity.Produit;
import com.c2a.gestionventes.entity.User;
import com.c2a.gestionventes.enums.StatutCommande;
import com.c2a.gestionventes.repository.ClientRepository;
import com.c2a.gestionventes.repository.CommandeRepository;
import com.c2a.gestionventes.repository.ProduitRepository;
import com.c2a.gestionventes.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

// ===========================
// COMMANDE SERVICE
// ===========================
@Service("commandeService")
@RequiredArgsConstructor
public class CommandeServiceImpl {

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final UserRepository userRepository;

    public List<BusinessDTOs.CommandeResponse> findAll() {
        return commandeRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BusinessDTOs.CommandeResponse findById(Long id) {
        return toResponse(commandeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Commande non trouvée: " + id)));
    }

    public List<BusinessDTOs.CommandeResponse> findBySite(String site) {
        return commandeRepository.findBySite(site).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BusinessDTOs.CommandeResponse> findByStatut(StatutCommande statut) {
        return commandeRepository.findByStatut(statut).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public BusinessDTOs.CommandeResponse create(BusinessDTOs.CommandeRequest req) {
        Client client = clientRepository.findById(req.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé"));

        Commande commande = Commande.builder()
                .numero(genererNumero()).client(client)
                .remiseGlobale(req.getRemiseGlobale()).tva(req.getTva())
                .site(req.getSite() != null ? req.getSite() : client.getSite())
                .adresseLivraison(req.getAdresseLivraison())
                .observations(req.getObservations())
                .conditionsPaiement(req.getConditionsPaiement())
                .dateLivraisonPrevue(req.getDateLivraisonPrevue())
                .build();

        if (req.getCommercialId() != null)
            commande.setCommercial(userRepository.findById(req.getCommercialId()).orElse(null));

        List<LigneCommande> lignes = req.getLignes().stream().map(lr -> {
            Produit p = produitRepository.findById(lr.getProduitId())
                    .orElseThrow(() -> new EntityNotFoundException("Produit non trouvé: " + lr.getProduitId()));
            LigneCommande lc = LigneCommande.builder()
                    .commande(commande).produit(p).quantite(lr.getQuantite())
                    .prixUnitaire(lr.getPrixUnitaire()).remise(lr.getRemise()).build();
            lc.calculer();
            return lc;
        }).collect(Collectors.toList());

        commande.setLignes(lignes);
        commande.calculerMontants();
        return toResponse(commandeRepository.save(commande));
    }

    @Transactional
    public BusinessDTOs.CommandeResponse createDemandeClient(BusinessDTOs.ClientAchatRequest req, String email) {
        Client client = clientRepository.findByEmail(email)
                .orElseGet(() -> createClientFromUser(email));
        Produit produit = produitRepository.findById(req.getProduitId())
                .orElseThrow(() -> new EntityNotFoundException("Produit non trouve: " + req.getProduitId()));

        Commande commande = Commande.builder()
                .numero(genererNumero())
                .client(client)
                .site(client.getSite())
                .observations(req.getObservations())
                .conditionsPaiement("Demande client")
                .build();

        LigneCommande ligne = LigneCommande.builder()
                .commande(commande)
                .produit(produit)
                .quantite(req.getQuantite())
                .prixUnitaire(produit.getPrixVente())
                .remise(0.0)
                .build();
        ligne.calculer();

        commande.setLignes(List.of(ligne));
        commande.calculerMontants();
        return toResponse(commandeRepository.save(commande));
    }

    @Transactional
    public BusinessDTOs.CommandeResponse changerStatut(Long id, StatutCommande statut, Authentication authentication) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Commande non trouvée: " + id));
        verifierTransitionAutorisee(commande.getStatut(), statut, authentication);
        commande.setStatut(statut);
        return toResponse(commandeRepository.save(commande));
    }

    private void verifierTransitionAutorisee(StatutCommande actuel, StatutCommande cible, Authentication authentication) {
        if (hasRole(authentication, "COMMERCIAL") && actuel == StatutCommande.EN_ATTENTE && cible == StatutCommande.CONFIRMEE) {
            return;
        }
        if (hasRole(authentication, "MAGASINIER")) {
            boolean preparation = actuel == StatutCommande.CONFIRMEE && cible == StatutCommande.EN_PREPARATION;
            boolean expedition = actuel == StatutCommande.EN_PREPARATION && cible == StatutCommande.EXPEDIEE;
            boolean livraison = actuel == StatutCommande.EXPEDIEE && cible == StatutCommande.LIVREE;
            if (preparation || expedition || livraison) {
                return;
            }
        }
        throw new AccessDeniedException("Transition de commande non autorisee pour ce role");
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
    }

    private String genererNumero() {
        String prefix = "CMD-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM")) + "-";
        String last = commandeRepository.findLastNumero(prefix);
        int next = (last != null) ? Integer.parseInt(last.replace(prefix, "")) + 1 : 1;
        return prefix + String.format("%04d", next);
    }

    private Client createClientFromUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur client non trouve: " + email));
        Client client = Client.builder()
                .nom((user.getNom() + " " + user.getPrenom()).trim())
                .telephone(user.getTelephone() != null ? user.getTelephone() : "00000000")
                .email(user.getEmail())
                .site(user.getSite())
                .creditMax(0.0)
                .actif(true)
                .build();
        return clientRepository.save(client);
    }

    BusinessDTOs.CommandeResponse toResponse(Commande c) {
        BusinessDTOs.CommandeResponse r = new BusinessDTOs.CommandeResponse();
        r.setId(c.getId());
        r.setNumero(c.getNumero());
        r.setStatut(c.getStatut());
        r.setRemiseGlobale(c.getRemiseGlobale());
        r.setMontantHT(c.getMontantHT());
        r.setTva(c.getTva());
        r.setMontantTTC(c.getMontantTTC());
        r.setSite(c.getSite());
        r.setAdresseLivraison(c.getAdresseLivraison());
        r.setObservations(c.getObservations());
        r.setDateCommande(c.getDateCommande());
        r.setDateLivraisonPrevue(c.getDateLivraisonPrevue());
        if (c.getClient() != null) {
            BusinessDTOs.ClientResponse cr = new BusinessDTOs.ClientResponse();
            cr.setId(c.getClient().getId());
            cr.setNom(c.getClient().getNom());
            cr.setTelephone(c.getClient().getTelephone());
            cr.setSite(c.getClient().getSite());
            r.setClient(cr);
        }
        if (c.getCommercial() != null)
            r.setCommercialNom(c.getCommercial().getNom() + " " + c.getCommercial().getPrenom());
        if (c.getLignes() != null) {
            r.setLignes(c.getLignes().stream().map(l -> {
                BusinessDTOs.LigneResponse lr = new BusinessDTOs.LigneResponse();
                lr.setId(l.getId());
                lr.setProduitId(l.getProduit().getId());
                lr.setProduitDesignation(l.getProduit().getDesignation());
                lr.setProduitReference(l.getProduit().getReference());
                lr.setProduitUnite(l.getProduit().getUnite());
                lr.setQuantite(l.getQuantite());
                lr.setPrixUnitaire(l.getPrixUnitaire());
                lr.setRemise(l.getRemise());
                lr.setMontantLigne(l.getMontantLigne());
                return lr;
            }).collect(Collectors.toList()));
        }
        return r;
    }
}
