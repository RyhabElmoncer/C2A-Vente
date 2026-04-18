package com.c2a.gestionventes.dto;

import com.c2a.gestionventes.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
}
