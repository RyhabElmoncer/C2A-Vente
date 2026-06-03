package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.enums.StatutDevis;
import com.c2a.gestionventes.service.impl.DevisServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ===========================
// DEVIS CONTROLLER
// ===========================
@RestController
@RequestMapping("/devis")
@RequiredArgsConstructor
class DevisController {

    private final DevisServiceImpl devisService;

    @GetMapping
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<List<BusinessDTOs.DevisResponse>> findAll() {
        return ResponseEntity.ok(devisService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<BusinessDTOs.DevisResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(devisService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<BusinessDTOs.DevisResponse> create(@Valid @RequestBody BusinessDTOs.DevisRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(devisService.create(request));
    }

    @PatchMapping("/{id}/statut/{statut}")
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<BusinessDTOs.DevisResponse> changerStatut(@PathVariable Long id, @PathVariable StatutDevis statut) {
        return ResponseEntity.ok(devisService.changerStatut(id, statut));
    }

    @PostMapping("/{id}/convertir")
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<BusinessDTOs.CommandeResponse> convertirEnCommande(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(devisService.convertirEnCommande(id));
    }
}
