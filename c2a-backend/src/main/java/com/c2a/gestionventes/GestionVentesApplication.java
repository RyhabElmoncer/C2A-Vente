package com.c2a.gestionventes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GestionVentesApplication {
    public static void main(String[] args) {
        SpringApplication.run(GestionVentesApplication.class, args);
    }
}
