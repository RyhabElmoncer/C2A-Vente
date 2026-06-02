package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findBySite(String site);
    List<Client> findByActifTrue();
    List<Client> findByNomContainingIgnoreCase(String nom);
    @Query("SELECT c FROM Client c WHERE c.soldeCreance > 0")
    List<Client> findClientsAvecCreances();
    @Query("SELECT c FROM Client c WHERE c.soldeCreance >= c.creditMax")
    List<Client> findClientsDepasse();
}
