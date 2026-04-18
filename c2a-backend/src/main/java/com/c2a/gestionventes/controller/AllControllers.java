package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.AuthDTOs.*;
import com.c2a.gestionventes.dto.BusinessDTOs.*;
import com.c2a.gestionventes.enums.*;
import com.c2a.gestionventes.service.impl.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ===========================
// AUTH CONTROLLER
// ===========================
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}

// ===========================
// CLIENT CONTROLLER
// ===========================
@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
class ClientController {

    private final ClientServiceImpl clientService;

    @GetMapping
    public ResponseEntity<List<ClientResponse>> findAll() {
        return ResponseEntity.ok(clientService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @GetMapping("/site/{site}")
    public ResponseEntity<List<ClientResponse>> findBySite(@PathVariable String site) {
        return ResponseEntity.ok(clientService.findBySite(site));
    }

    @GetMapping("/creances")
    @PreAuthorize("hasAnyRole('COMPTABLE','GERANT','ADMIN','AGENT_RECOUVREMENT')")
    public ResponseEntity<List<ClientResponse>> findAvecCreances() {
        return ResponseEntity.ok(clientService.findAvecCreances());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMMERCIAL','ADMIN','GERANT')")
    public ResponseEntity<ClientResponse> create(@Valid @RequestBody ClientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMMERCIAL','ADMIN','GERANT')")
    public ResponseEntity<ClientResponse> update(@PathVariable Long id, @Valid @RequestBody ClientRequest request) {
        return ResponseEntity.ok(clientService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GERANT')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

// ===========================
// PRODUIT CONTROLLER
// ===========================
@RestController
@RequestMapping("/produits")
@RequiredArgsConstructor
class ProduitController {

    private final ProduitServiceImpl produitService;

    @GetMapping
    public ResponseEntity<List<ProduitResponse>> findAll() {
        return ResponseEntity.ok(produitService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.findById(id));
    }

    @GetMapping("/rupture")
    public ResponseEntity<List<ProduitResponse>> findEnRupture() {
        return ResponseEntity.ok(produitService.findEnRupture());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERANT','MAGASINIER')")
    public ResponseEntity<ProduitResponse> create(@Valid @RequestBody ProduitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produitService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GERANT','MAGASINIER')")
    public ResponseEntity<ProduitResponse> update(@PathVariable Long id, @Valid @RequestBody ProduitRequest request) {
        return ResponseEntity.ok(produitService.update(id, request));
    }
}

// ===========================
// DEVIS CONTROLLER
// ===========================
@RestController
@RequestMapping("/devis")
@RequiredArgsConstructor
class DevisController {

    private final DevisServiceImpl devisService;

    @GetMapping
    public ResponseEntity<List<DevisResponse>> findAll() {
        return ResponseEntity.ok(devisService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DevisResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(devisService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMMERCIAL','ADMIN','GERANT')")
    public ResponseEntity<DevisResponse> create(@Valid @RequestBody DevisRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(devisService.create(request));
    }

    @PatchMapping("/{id}/statut/{statut}")
    @PreAuthorize("hasAnyRole('COMMERCIAL','ADMIN','GERANT')")
    public ResponseEntity<DevisResponse> changerStatut(@PathVariable Long id, @PathVariable StatutDevis statut) {
        return ResponseEntity.ok(devisService.changerStatut(id, statut));
    }

    @PostMapping("/{id}/convertir")
    @PreAuthorize("hasAnyRole('COMMERCIAL','ADMIN','GERANT')")
    public ResponseEntity<CommandeResponse> convertirEnCommande(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(devisService.convertirEnCommande(id));
    }
}

// ===========================
// COMMANDE CONTROLLER
// ===========================
@RestController
@RequestMapping("/commandes")
@RequiredArgsConstructor
class CommandeController {

    private final CommandeServiceImpl commandeService;

    @GetMapping
    public ResponseEntity<List<CommandeResponse>> findAll() {
        return ResponseEntity.ok(commandeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommandeResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.findById(id));
    }

    @GetMapping("/site/{site}")
    public ResponseEntity<List<CommandeResponse>> findBySite(@PathVariable String site) {
        return ResponseEntity.ok(commandeService.findBySite(site));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<CommandeResponse>> findByStatut(@PathVariable StatutCommande statut) {
        return ResponseEntity.ok(commandeService.findByStatut(statut));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMMERCIAL','ADMIN','GERANT')")
    public ResponseEntity<CommandeResponse> create(@Valid @RequestBody CommandeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commandeService.create(request));
    }

    @PatchMapping("/{id}/statut/{statut}")
    @PreAuthorize("hasAnyRole('COMMERCIAL','ADMIN','GERANT','MAGASINIER')")
    public ResponseEntity<CommandeResponse> changerStatut(@PathVariable Long id, @PathVariable StatutCommande statut) {
        return ResponseEntity.ok(commandeService.changerStatut(id, statut));
    }
}

// ===========================
// FACTURE CONTROLLER
// ===========================
@RestController
@RequestMapping("/factures")
@RequiredArgsConstructor
class FactureController {

    private final FactureServiceImpl factureService;

    @GetMapping
    public ResponseEntity<List<FactureResponse>> findAll() {
        return ResponseEntity.ok(factureService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FactureResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.findById(id));
    }

    @GetMapping("/retard")
    @PreAuthorize("hasAnyRole('COMPTABLE','GERANT','ADMIN','AGENT_RECOUVREMENT')")
    public ResponseEntity<List<FactureResponse>> findEnRetard() {
        return ResponseEntity.ok(factureService.findEnRetard());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMMERCIAL','COMPTABLE','ADMIN','GERANT')")
    public ResponseEntity<FactureResponse> create(@Valid @RequestBody FactureRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(factureService.create(request));
    }

    @PostMapping("/paiements")
    @PreAuthorize("hasAnyRole('COMPTABLE','ADMIN','GERANT','AGENT_RECOUVREMENT')")
    public ResponseEntity<PaiementResponse> enregistrerPaiement(@Valid @RequestBody PaiementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(factureService.enregistrerPaiement(request));
    }
}

// ===========================
// STOCK CONTROLLER
// ===========================
@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
class StockController {

    private final StockServiceImpl stockService;

    @GetMapping("/mouvements/{produitId}")
    public ResponseEntity<List<MouvementStockResponse>> findByProduit(@PathVariable Long produitId) {
        return ResponseEntity.ok(stockService.findByProduit(produitId));
    }

    @GetMapping("/rupture")
    public ResponseEntity<List<ProduitResponse>> getProduitEnRupture() {
        return ResponseEntity.ok(stockService.getProduitEnRupture());
    }

    @PostMapping("/mouvements")
    @PreAuthorize("hasAnyRole('MAGASINIER','ADMIN','GERANT')")
    public ResponseEntity<MouvementStockResponse> enregistrerMouvement(
            @Valid @RequestBody MouvementStockRequest request,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stockService.enregistrerMouvement(request, userId));
    }
}
