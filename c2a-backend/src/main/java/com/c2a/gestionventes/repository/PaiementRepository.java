package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    List<Paiement> findByFactureId(Long factureId);
    @Query("SELECT p FROM Paiement p WHERE p.datePaiement BETWEEN :debut AND :fin")
    List<Paiement> findByPeriode(@Param("debut") LocalDate debut, @Param("fin") LocalDate fin);
    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.datePaiement BETWEEN :debut AND :fin AND p.statut = 'VALIDE'")
    Double sumEncaissements(@Param("debut") LocalDate debut, @Param("fin") LocalDate fin);
}
