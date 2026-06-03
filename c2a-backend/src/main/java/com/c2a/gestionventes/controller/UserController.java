package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.AuthDTOs;
import com.c2a.gestionventes.service.impl.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
class UserController {

    private final UserServiceImpl userService;

    @GetMapping
    public ResponseEntity<List<AuthDTOs.UserResponse>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PostMapping
    public ResponseEntity<AuthDTOs.UserResponse> create(@Valid @RequestBody AuthDTOs.RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthDTOs.UserResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AuthDTOs.UserUpdateRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        userService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}
