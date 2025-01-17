package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Role;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class RoleRepositoryImpl implements RoleRepository {

    private EntityManager entityManager;

    public  RoleRepositoryImpl(EntityManager entityManager)
    {
        this.entityManager = entityManager;
    }
    @Override
    public Optional<Role> findByName(String name) {
        try {

            Role role = entityManager.createQuery("FROM Role where name = :name",Role.class)
                    .setParameter("name",name)
                    .getSingleResult();

            return Optional.of(role);
        }catch (Exception e){
            return Optional.empty();
        }
    }

    @Override
    @Transactional
    public void save(Role role) {
        try {
            entityManager.persist(role);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
