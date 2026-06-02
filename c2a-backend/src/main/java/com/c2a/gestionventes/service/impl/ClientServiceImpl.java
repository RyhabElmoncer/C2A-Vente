package com.c2a.gestionventes.service.impl;

import com.c2a.gestionventes.dto.BusinessDTOs;
import com.c2a.gestionventes.entity.Client;
import com.c2a.gestionventes.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// ===========================
// CLIENT SERVICE
// ===========================
@Service
@RequiredArgsConstructor
public class ClientServiceImpl {

    private final ClientRepository clientRepository;

    public List<BusinessDTOs.ClientResponse> findAll() {
        return clientRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BusinessDTOs.ClientResponse findById(Long id) {
        return toResponse(clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé: " + id)));
    }

    public List<BusinessDTOs.ClientResponse> findBySite(String site) {
        return clientRepository.findBySite(site).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BusinessDTOs.ClientResponse> findAvecCreances() {
        return clientRepository.findClientsAvecCreances().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public BusinessDTOs.ClientResponse create(BusinessDTOs.ClientRequest req) {
        Client client = Client.builder()
                .nom(req.getNom()).raisonSociale(req.getRaisonSociale())
                .matriculeFiscal(req.getMatriculeFiscal()).telephone(req.getTelephone())
                .email(req.getEmail()).adresse(req.getAdresse()).ville(req.getVille())
                .codePostal(req.getCodePostal()).site(req.getSite())
                .creditMax(req.getCreditMax() != null ? req.getCreditMax() : 0.0)
                .build();
        return toResponse(clientRepository.save(client));
    }

    @Transactional
    public BusinessDTOs.ClientResponse update(Long id, BusinessDTOs.ClientRequest req) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé: " + id));
        client.setNom(req.getNom());
        client.setTelephone(req.getTelephone());
        client.setEmail(req.getEmail());
        client.setAdresse(req.getAdresse());
        client.setVille(req.getVille());
        client.setSite(req.getSite());
        client.setCreditMax(req.getCreditMax());
        return toResponse(clientRepository.save(client));
    }

    @Transactional
    public void delete(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client non trouvé: " + id));
        client.setActif(false);
        clientRepository.save(client);
    }

    BusinessDTOs.ClientResponse toResponse(Client c) {
        BusinessDTOs.ClientResponse r = new BusinessDTOs.ClientResponse();
        r.setId(c.getId());
        r.setNom(c.getNom());
        r.setRaisonSociale(c.getRaisonSociale());
        r.setTelephone(c.getTelephone());
        r.setEmail(c.getEmail());
        r.setAdresse(c.getAdresse());
        r.setVille(c.getVille());
        r.setSite(c.getSite());
        r.setCreditMax(c.getCreditMax());
        r.setSoldeCreance(c.getSoldeCreance());
        r.setActif(c.isActif());
        return r;
    }
}
