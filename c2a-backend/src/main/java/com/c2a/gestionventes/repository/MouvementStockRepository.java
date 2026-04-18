package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.MouvementStock;
import com.c2a.gestionventes.enums.TypeMouvement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MouvementStockRepository extends JpaRepository<MouvementStock, Long> {
    List<MouvementStock> findByProduitIdOrderByDateOperationDesc(Long produitId);
    List<MouvementStock> findByType(TypeMouvement type);
    @Query("SELECT m FROM MouvementStock m WHERE m.dateOperation BETWEEN :debut AND :fin")
    List<MouvementStock> findByPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);
}
