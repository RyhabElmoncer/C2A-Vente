package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    List<Client> findBySite(String site);
    List<Client> findByActifTrue();
    List<Client> findByNomContainingIgnoreCase(String nom);
    @Query("SELECT c FROM Client c WHERE c.soldeCreance > 0")
    List<Client> findClientsAvecCreances();
    @Query("SELECT c FROM Client c WHERE c.soldeCreance >= c.creditMax")
    List<Client> findClientsDepasse();
}
