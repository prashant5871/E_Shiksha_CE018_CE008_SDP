package com.Eshiksha;


import com.Eshiksha.Entities.Role;
import com.Eshiksha.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("ROLE_STUDENT").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_STUDENT"));
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
        }

        if (roleRepository.findByName("ROLE_TEACHER").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_TEACHER"));
        }
    }
}