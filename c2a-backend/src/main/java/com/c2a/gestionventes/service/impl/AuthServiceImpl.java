package com.c2a.gestionventes.service.impl;

import com.c2a.gestionventes.dto.AuthDTOs.*;
import com.c2a.gestionventes.entity.User;
import com.c2a.gestionventes.exception.BusinessException;
import com.c2a.gestionventes.repository.UserRepository;
import com.c2a.gestionventes.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + email));
    }

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
}
