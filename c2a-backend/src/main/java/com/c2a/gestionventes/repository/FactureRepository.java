package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.Facture;
import com.c2a.gestionventes.enums.StatutFacture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByNumero(String numero);
    List<Facture> findByStatut(StatutFacture statut);
    List<Facture> findByCommandeClientId(Long clientId);
    @Query("SELECT f FROM Facture f WHERE f.dateEcheance < :date AND f.statut IN ('EMISE','PARTIELLEMENT_PAYEE')")
    List<Facture> findEnRetard(@Param("date") LocalDate date);
    @Query("SELECT SUM(f.montantRestant) FROM Facture f WHERE f.statut IN ('EMISE','PARTIELLEMENT_PAYEE')")
    Double sumCreancesTotales();
}
