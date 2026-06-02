package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.service.impl.FactureServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ===========================
// FACTURE CONTROLLER
// ===========================
@RestController
@RequestMapping("/factures")
@RequiredArgsConstructor
class FactureController {

    private final FactureServiceImpl factureService;

    @GetMapping
    @PreAuthorize("!hasRole('CLIENT')")
    public ResponseEntity<List<BusinessDTOs.FactureResponse>> findAll() {
        return ResponseEntity.ok(factureService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("!hasRole('CLIENT')")
    public ResponseEntity<BusinessDTOs.FactureResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.findById(id));
    }

    @GetMapping("/retard")
    @PreAuthorize("hasAnyRole('COMPTABLE','GERANT','ADMIN','AGENT_RECOUVREMENT')")
    public ResponseEntity<List<BusinessDTOs.FactureResponse>> findEnRetard() {
        return ResponseEntity.ok(factureService.findEnRetard());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMMERCIAL','COMPTABLE','ADMIN','GERANT')")
    public ResponseEntity<BusinessDTOs.FactureResponse> create(@Valid @RequestBody BusinessDTOs.FactureRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(factureService.create(request));
    }

    @PostMapping("/paiements")
    @PreAuthorize("hasAnyRole('COMPTABLE','ADMIN','GERANT','AGENT_RECOUVREMENT')")
    public ResponseEntity<BusinessDTOs.PaiementResponse> enregistrerPaiement(@Valid @RequestBody BusinessDTOs.PaiementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(factureService.enregistrerPaiement(request));
    }
}
