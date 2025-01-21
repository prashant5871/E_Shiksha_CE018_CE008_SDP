package com.Eshiksha.repositories;

import com.Eshiksha.Entities.ApplicationUser;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
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

            String sql = "FROM ApplicationUser WHERE email = :email";

            ApplicationUser user = entityManager
                    .createQuery(sql, ApplicationUser.class)
                    .setParameter("email", email)
                    .getSingleResult();
            System.out.println("user classs type : " + user.getClass().getName());
            return Optional.ofNullable(user);

        } catch (NoResultException e) {
            return Optional.empty();
        }
    }


    @Override
    public ApplicationUser findByVarificationCode(String varificationCode) {

        ApplicationUser appUser = entityManager.createQuery("FROM ApplicationUser where varificationCode=:varificationCode", ApplicationUser.class)
                .setParameter("varificationCode",varificationCode)
                .getSingleResult();

        return appUser;
    }

    @Override
    @Transactional
    public void merge(ApplicationUser appUser) {
        this.entityManager.merge(appUser);
    }

}
