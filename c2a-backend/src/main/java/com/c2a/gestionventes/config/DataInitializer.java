package com.c2a.gestionventes.config;

import com.c2a.gestionventes.entity.Client;
import com.c2a.gestionventes.entity.User;
import com.c2a.gestionventes.enums.Role;
import com.c2a.gestionventes.repository.ClientRepository;
import com.c2a.gestionventes.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

// ===========================
// DATA INITIALIZER
// ===========================
@org.springframework.stereotype.Component
@RequiredArgsConstructor
class DataInitializer {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        createUserIfMissing("Admin", "C2A", "admin@c2a.tn", "admin123", Role.ADMIN, "Sfax");
        createUserIfMissing("Dammak", "Mohamed", "gerant@c2a.tn", "gerant123", Role.GERANT, "Sfax");
        createUserIfMissing("Commercial", "Sfax", "commercial@c2a.tn", "commercial123", Role.COMMERCIAL, "Sfax");
        createUserIfMissing("Comptable", "C2A", "comptable@c2a.tn", "comptable123", Role.COMPTABLE, "Sfax");
        createUserIfMissing("Recouvrement", "C2A", "agent@c2a.tn", "agent1234", Role.AGENT_RECOUVREMENT, "Sfax");
        createUserIfMissing("Stock", "C2A", "stock@c2a.tn", "stock123", Role.MAGASINIER, "Sfax");
        createUserIfMissing("Client", "C2A", "client@c2a.tn", "client123", Role.CLIENT, "Sfax");
        createClientIfMissing();
        System.out.println(">>> Comptes C2A initialises !");
    }

    private void createUserIfMissing(String nom, String prenom, String email, String password, Role role, String site) {
        if (userRepository.existsByEmail(email)) return;
        userRepository.save(User.builder()
                .nom(nom)
                .prenom(prenom)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .site(site)
                .actif(true)
                .build());
    }

    private void createClientIfMissing() {
        if (clientRepository.findByEmail("client@c2a.tn").isPresent()) return;
        clientRepository.save(Client.builder()
                .nom("Client C2A")
                .telephone("00000000")
                .email("client@c2a.tn")
                .site("Sfax")
                .creditMax(0.0)
                .actif(true)
                .build());
    }
}
