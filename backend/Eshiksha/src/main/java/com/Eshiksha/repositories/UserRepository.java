package com.Eshiksha.repositories;

import com.Eshiksha.Entities.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<ApplicationUser, Integer> {

    // Find user by email
    Optional<ApplicationUser> findByEmail(String email);

    Optional<ApplicationUser> findByVarificationCode(String varificationCode);

    // Find all users who are enabled
    List<ApplicationUser> findByEnabledTrue();

    // Custom Query to fetch users with specific roles
    @Query("SELECT u FROM ApplicationUser u JOIN u.roles r WHERE r.name = :roleName")
    List<ApplicationUser> findByRole(String roleName);

    // Delete user by email
    void deleteByEmail(String email);

    // Check if a user exists by email
    boolean existsByEmail(String email);
}
