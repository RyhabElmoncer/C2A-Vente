package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.BusinessDTOs.*;
import com.c2a.gestionventes.service.impl.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
class StockController {

    private final StockServiceImpl stockService;

    @GetMapping("/mouvements/{produitId}")
    @PreAuthorize("hasRole('MAGASINIER')")
    public ResponseEntity<List<MouvementStockResponse>> findByProduit(@PathVariable Long produitId) {
        return ResponseEntity.ok(stockService.findByProduit(produitId));
    }

    @GetMapping("/rupture")
    @PreAuthorize("hasRole('MAGASINIER')")
    public ResponseEntity<List<ProduitResponse>> getProduitEnRupture() {
        return ResponseEntity.ok(stockService.getProduitEnRupture());
    }

    @PostMapping("/mouvements")
    @PreAuthorize("hasRole('MAGASINIER')")
    public ResponseEntity<MouvementStockResponse> enregistrerMouvement(
            @Valid @RequestBody MouvementStockRequest request,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stockService.enregistrerMouvement(request, userId));
    }
}
