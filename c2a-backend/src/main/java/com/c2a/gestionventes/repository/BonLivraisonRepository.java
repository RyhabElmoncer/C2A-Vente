package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.BonLivraison;
import com.c2a.gestionventes.enums.StatutBonLivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BonLivraisonRepository extends JpaRepository<BonLivraison, Long> {
    Optional<BonLivraison> findByNumero(String numero);
    List<BonLivraison> findByStatut(StatutBonLivraison statut);
    List<BonLivraison> findByCommandeId(Long commandeId);
}
