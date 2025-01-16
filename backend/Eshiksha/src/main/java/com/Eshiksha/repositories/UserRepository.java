package com.Eshiksha.repositories;

import com.Eshiksha.Entities.ApplicationUser;

import java.util.Optional;

public interface UserRepository {
    public Optional<ApplicationUser> findByEmail(String email);
}
