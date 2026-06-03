package com.c2a.gestionventes.service.impl;

import com.c2a.gestionventes.dto.AuthDTOs;
import com.c2a.gestionventes.entity.User;
import com.c2a.gestionventes.exception.BusinessException;
import com.c2a.gestionventes.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AuthDTOs.UserResponse> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public AuthDTOs.UserResponse create(AuthDTOs.RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Email deja utilise : " + email);
        }

        User user = User.builder()
                .nom(request.getNom().trim())
                .prenom(request.getPrenom().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .site(request.getSite().trim())
                .telephone(clean(request.getTelephone()))
                .actif(true)
                .build();

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public AuthDTOs.UserResponse update(Long id, AuthDTOs.UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouve : " + id));

        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailAndIdNot(email, id)) {
            throw new BusinessException("Email deja utilise : " + email);
        }

        user.setNom(request.getNom().trim());
        user.setPrenom(request.getPrenom().trim());
        user.setEmail(email);
        user.setRole(request.getRole());
        user.setSite(request.getSite().trim());
        user.setTelephone(clean(request.getTelephone()));
        if (request.getActif() != null) {
            user.setActif(request.getActif());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getPassword().length() < 8) {
                throw new BusinessException("Le mot de passe doit contenir au moins 8 caracteres");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deactivate(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouve : " + id));
        user.setActif(false);
        userRepository.save(user);
    }

    private AuthDTOs.UserResponse toResponse(User user) {
        AuthDTOs.UserResponse response = new AuthDTOs.UserResponse();
        response.setId(user.getId());
        response.setNom(user.getNom());
        response.setPrenom(user.getPrenom());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setSite(user.getSite());
        response.setTelephone(user.getTelephone());
        response.setActif(user.isActif());
        return response;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
