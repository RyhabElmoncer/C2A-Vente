package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.enums.StatutCommande;
import com.c2a.gestionventes.service.impl.CommandeServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ===========================
// COMMANDE CONTROLLER
// ===========================
@RestController
@RequestMapping("/commandes")
@RequiredArgsConstructor
class CommandeController {

    private final CommandeServiceImpl commandeService;

    @GetMapping
    @PreAuthorize("!hasRole('CLIENT')")
    public ResponseEntity<List<BusinessDTOs.CommandeResponse>> findAll() {
        return ResponseEntity.ok(commandeService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("!hasRole('CLIENT')")
    public ResponseEntity<BusinessDTOs.CommandeResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(commandeService.findById(id));
    }

    @GetMapping("/site/{site}")
    @PreAuthorize("!hasRole('CLIENT')")
    public ResponseEntity<List<BusinessDTOs.CommandeResponse>> findBySite(@PathVariable String site) {
        return ResponseEntity.ok(commandeService.findBySite(site));
    }

    @GetMapping("/statut/{statut}")
    @PreAuthorize("!hasRole('CLIENT')")
    public ResponseEntity<List<BusinessDTOs.CommandeResponse>> findByStatut(@PathVariable StatutCommande statut) {
        return ResponseEntity.ok(commandeService.findByStatut(statut));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMMERCIAL','ADMIN','GERANT')")
    public ResponseEntity<BusinessDTOs.CommandeResponse> create(@Valid @RequestBody BusinessDTOs.CommandeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commandeService.create(request));
    }

    @PostMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<BusinessDTOs.CommandeResponse> demanderAchat(
            @Valid @RequestBody BusinessDTOs.ClientAchatRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commandeService.createDemandeClient(request, authentication.getName()));
    }

    @PatchMapping("/{id}/statut/{statut}")
    @PreAuthorize("hasAnyRole('COMMERCIAL','ADMIN','GERANT','MAGASINIER')")
    public ResponseEntity<BusinessDTOs.CommandeResponse> changerStatut(@PathVariable Long id, @PathVariable StatutCommande statut) {
        return ResponseEntity.ok(commandeService.changerStatut(id, statut));
    }
}
