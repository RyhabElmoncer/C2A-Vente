package com.c2a.gestionventes.controller;

import com.c2a.gestionventes.dto.BusinessDTOs.*;
import com.c2a.gestionventes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
class DashboardController {

    private final CommandeRepository commandeRepository;
    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final FactureRepository factureRepository;
    private final PaiementRepository paiementRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('GERANT','ADMIN','COMMERCIAL','COMPTABLE')")
    public ResponseEntity<DashboardDTO> getDashboard() {
        DashboardDTO dto = new DashboardDTO();
        LocalDate debutMois = LocalDate.now().withDayOfMonth(1);
        LocalDate debutAnnee = LocalDate.now().withDayOfYear(1);
        LocalDate fin = LocalDate.now();

        dto.setChiffreAffairesMois(
            safeDouble(commandeRepository.sumChiffreAffaires(debutMois, fin)));
        dto.setChiffreAffairesAnnee(
            safeDouble(commandeRepository.sumChiffreAffaires(debutAnnee, fin)));
        dto.setNombreCommandesMois(
            (long) commandeRepository.findByPeriode(debutMois, fin).size());
        dto.setNombreClientsActifs((long) clientRepository.findByActifTrue().size());
        dto.setNombreProduitsRupture((long) produitRepository.findEnRupture().size());
        dto.setTotalCreances(safeDouble(factureRepository.sumCreancesTotales()));
        dto.setEncaissementsMois(
            safeDouble(paiementRepository.sumEncaissements(debutMois, fin)));

        // Ventes par mois (12 derniers mois)
        List<VenteParMoisDTO> ventesParMois = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            LocalDate debut = LocalDate.now().minusMonths(i).withDayOfMonth(1);
            LocalDate finMois = debut.withDayOfMonth(debut.lengthOfMonth());
            VenteParMoisDTO v = new VenteParMoisDTO();
            v.setMois(debut.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            v.setMontant(safeDouble(commandeRepository.sumChiffreAffaires(debut, finMois)));
            v.setNombreCommandes((long) commandeRepository.findByPeriode(debut, finMois).size());
            ventesParMois.add(v);
        }
        dto.setVentesParMois(ventesParMois);
        return ResponseEntity.ok(dto);
    }

    private Double safeDouble(Double val) { return val != null ? val : 0.0; }
}

