package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.service.impl.ProduitServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
class PublicController {

    private final ProduitServiceImpl produitService;

    @GetMapping("/produits")
    public ResponseEntity<List<BusinessDTOs.PublicProduitResponse>> findProduits() {
        return ResponseEntity.ok(produitService.findPublicProduits());
    }
}
