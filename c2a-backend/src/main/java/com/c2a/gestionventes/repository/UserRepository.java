package com.c2a.gestionventes.repository;

import com.c2a.gestionventes.entity.User;
import com.c2a.gestionventes.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
    List<User> findByRole(Role role);
    List<User> findBySite(String site);
    List<User> findByActifTrue();
}
