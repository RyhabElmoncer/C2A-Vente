package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.service.impl.ClientServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ===========================
// CLIENT CONTROLLER
// ===========================
@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
class ClientController {

    private final ClientServiceImpl clientService;

    @GetMapping
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<List<BusinessDTOs.ClientResponse>> findAll() {
        return ResponseEntity.ok(clientService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<BusinessDTOs.ClientResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @GetMapping("/site/{site}")
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<List<BusinessDTOs.ClientResponse>> findBySite(@PathVariable String site) {
        return ResponseEntity.ok(clientService.findBySite(site));
    }

    @GetMapping("/creances")
    @PreAuthorize("hasAnyRole('COMPTABLE','AGENT_RECOUVREMENT')")
    public ResponseEntity<List<BusinessDTOs.ClientResponse>> findAvecCreances() {
        return ResponseEntity.ok(clientService.findAvecCreances());
    }

    @PostMapping
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<BusinessDTOs.ClientResponse> create(@Valid @RequestBody BusinessDTOs.ClientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<BusinessDTOs.ClientResponse> update(@PathVariable Long id, @Valid @RequestBody BusinessDTOs.ClientRequest request) {
        return ResponseEntity.ok(clientService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMMERCIAL')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
