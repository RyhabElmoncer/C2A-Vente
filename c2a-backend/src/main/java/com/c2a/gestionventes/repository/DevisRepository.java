package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.Devis;
import com.c2a.gestionventes.enums.StatutDevis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DevisRepository extends JpaRepository<Devis, Long> {
    Optional<Devis> findByNumero(String numero);
    List<Devis> findByClientId(Long clientId);
    List<Devis> findByStatut(StatutDevis statut);
    List<Devis> findByCommercialId(Long commercialId);
    @Query("SELECT d FROM Devis d WHERE d.dateValidite < :date AND d.statut = 'ENVOYE'")
    List<Devis> findExpires(@Param("date") LocalDate date);
    @Query("SELECT MAX(d.numero) FROM Devis d WHERE d.numero LIKE :prefix%")
    String findLastNumero(@Param("prefix") String prefix);
}
