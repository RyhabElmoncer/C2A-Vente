package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.Commande;
import com.c2a.gestionventes.enums.StatutCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    Optional<Commande> findByNumero(String numero);
    List<Commande> findByClientId(Long clientId);
    List<Commande> findByStatut(StatutCommande statut);
    List<Commande> findBySite(String site);
    @Query("SELECT c FROM Commande c WHERE c.dateCommande BETWEEN :debut AND :fin")
    List<Commande> findByPeriode(@Param("debut") LocalDate debut, @Param("fin") LocalDate fin);
    @Query("SELECT SUM(c.montantTTC) FROM Commande c WHERE c.dateCommande BETWEEN :debut AND :fin AND c.statut != 'ANNULEE'")
    Double sumChiffreAffaires(@Param("debut") LocalDate debut, @Param("fin") LocalDate fin);
}
