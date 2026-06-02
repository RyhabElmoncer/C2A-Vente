package com.c2a.gestionventes.service.impl;

import com.c2a.gestionventes.dto.AuthDTOs.*;
import com.c2a.gestionventes.entity.Client;
import com.c2a.gestionventes.entity.User;
import com.c2a.gestionventes.enums.Role;
import com.c2a.gestionventes.exception.BusinessException;
import com.c2a.gestionventes.repository.ClientRepository;
import com.c2a.gestionventes.repository.UserRepository;
import com.c2a.gestionventes.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {  // no longer implements UserDetailsService

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));
        if (!user.isActif()) throw new BusinessException("Compte désactivé");

        String token = jwtUtil.generateToken(user);
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setNom(user.getNom());
        response.setPrenom(user.getPrenom());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setSite(user.getSite());
        return response;
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new BusinessException("Email déjà utilisé : " + request.getEmail());
        User user = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .site(request.getSite())
                .telephone(request.getTelephone())
                .actif(true)
                .build();
        return userRepository.save(user);
    }

    @Transactional
    public User registerClient(ClientRegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword()))
            throw new BusinessException("La confirmation du mot de passe ne correspond pas");

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email) || clientRepository.findByEmail(email).isPresent())
            throw new BusinessException("Email deja utilise : " + email);

        User user = User.builder()
                .nom(request.getNom().trim())
                .prenom(request.getPrenom().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CLIENT)
                .site("Sfax")
                .telephone(request.getTelephone().trim())
                .actif(true)
                .build();

        User savedUser = userRepository.save(user);
        clientRepository.save(Client.builder()
                .nom((request.getNom().trim() + " " + request.getPrenom().trim()).trim())
                .telephone(request.getTelephone().trim())
                .email(email)
                .site("Sfax")
                .creditMax(0.0)
                .actif(true)
                .build());

        return savedUser;
    }
}
