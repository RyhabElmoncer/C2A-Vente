package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.service.impl.ProduitServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ===========================
// PRODUIT CONTROLLER
// ===========================
@RestController
@RequestMapping("/produits")
@RequiredArgsConstructor
class ProduitController {

    private final ProduitServiceImpl produitService;

    @GetMapping
    public ResponseEntity<List<BusinessDTOs.ProduitResponse>> findAll() {
        return ResponseEntity.ok(produitService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessDTOs.ProduitResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.findById(id));
    }

    @GetMapping("/rupture")
    @PreAuthorize("!hasRole('CLIENT')")
    public ResponseEntity<List<BusinessDTOs.ProduitResponse>> findEnRupture() {
        return ResponseEntity.ok(produitService.findEnRupture());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','GERANT','MAGASINIER')")
    public ResponseEntity<BusinessDTOs.ProduitResponse> create(@Valid @RequestBody BusinessDTOs.ProduitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produitService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','GERANT','MAGASINIER')")
    public ResponseEntity<BusinessDTOs.ProduitResponse> update(@PathVariable Long id, @Valid @RequestBody BusinessDTOs.ProduitRequest request) {
        return ResponseEntity.ok(produitService.update(id, request));
    }
}
