package com.Eshiksha.repositories;

import com.Eshiksha.Entities.Role;

import java.util.Optional;

public interface RoleRepository {
    public Optional<Role> findByName(String name);

    public void save(Role role);
}
