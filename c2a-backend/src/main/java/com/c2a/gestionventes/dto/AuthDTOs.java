package com.c2a.gestionventes.dto;

import com.c2a.gestionventes.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

// ---- Auth DTOs ----
public class AuthDTOs {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String type = "Bearer";
        private Long userId;
        private String nom;
        private String prenom;
        private String email;
        private String role;
        private String site;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank private String nom;
        @NotBlank private String prenom;
        @NotBlank @Email private String email;
        @NotBlank private String password;
        @NotNull private Role role;
        @NotBlank private String site;
        private String telephone;
    }

    @Data
    public static class ClientRegisterRequest {
        @NotBlank(message = "Le nom est obligatoire")
        private String nom;
        @NotBlank(message = "Le prenom est obligatoire")
        private String prenom;
        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Email invalide")
        private String email;
        @NotBlank(message = "Le telephone est obligatoire")
        private String telephone;
        @NotBlank(message = "Le mot de passe est obligatoire")
        @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caracteres")
        private String password;
        @NotBlank(message = "La confirmation est obligatoire")
        private String confirmPassword;
    }
}
