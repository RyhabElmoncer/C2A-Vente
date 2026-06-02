package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.service.impl.CatalogueAluminiumServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public/catalogue-aluminium")
@RequiredArgsConstructor
class CatalogueAluminiumController {

    private final CatalogueAluminiumServiceImpl catalogueService;

    @GetMapping
    public ResponseEntity<List<BusinessDTOs.CatalogueAluminiumResponse>> findAll(
            @RequestParam(required = false) String reference
    ) {
        return ResponseEntity.ok(catalogueService.findAll(reference));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessDTOs.CatalogueAluminiumResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(catalogueService.findById(id));
    }
}
