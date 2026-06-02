package com.c2a.gestionventes.service.impl;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.entity.CatalogueAluminium;
import com.c2a.gestionventes.repository.CatalogueAluminiumRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogueAluminiumServiceImpl {

    private final CatalogueAluminiumRepository repository;

    public List<BusinessDTOs.CatalogueAluminiumResponse> findAll(String reference) {
        List<CatalogueAluminium> profiles = reference == null || reference.isBlank()
                ? repository.findAll()
                : repository.findByReferenceContainingIgnoreCase(reference);
        return profiles.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BusinessDTOs.CatalogueAluminiumResponse findById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Profile aluminium non trouve: " + id)));
    }

    private BusinessDTOs.CatalogueAluminiumResponse toResponse(CatalogueAluminium profile) {
        BusinessDTOs.CatalogueAluminiumResponse response = new BusinessDTOs.CatalogueAluminiumResponse();
        response.setId(profile.getId());
        response.setReference(profile.getReference());
        response.setNom(profile.getNom());
        response.setCategorie(profile.getCategorie());
        response.setImage(profile.getImage());
        response.setLargeur(profile.getLargeur());
        response.setHauteur(profile.getHauteur());
        response.setDescription(profile.getDescription());
        return response;
    }
}
