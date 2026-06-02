package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.CatalogueAluminium;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CatalogueAluminiumRepository extends JpaRepository<CatalogueAluminium, Long> {
    List<CatalogueAluminium> findByReferenceContainingIgnoreCase(String reference);
}
