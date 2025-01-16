package com.Eshiksha.repositories;

import com.Eshiksha.Entities.ApplicationUser;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private EntityManager entityManager;

    public UserRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Optional<ApplicationUser> findByEmail(String email) {
        try {

            String sql = "SELECT * FROM application_user WHERE email = :email";

            ApplicationUser user = (ApplicationUser) entityManager
                    .createNativeQuery(sql, ApplicationUser.class)
                    .setParameter("email", email)
                    .getSingleResult();
            return Optional.ofNullable(user);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

}
