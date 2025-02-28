package com.Eshiksha.services;

import com.Eshiksha.Entities.ApplicationUser;
import com.Eshiksha.repositories.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if ("k_dev".equals(username)) {
            return buildAdminUser(username);
        } else if ("p_dev".equals(username)) {
            return buildAdminUser(username);
        }

        try {
            ApplicationUser appUser = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("user not found with username  " + username));

            return User.builder().username(appUser.getUsername()).password(appUser.getPassword()).authorities(appUser.getRoles()
                            .stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList()))
                    .build();
        } catch (Exception e) {
            return null;
        }
    }

    public ApplicationUser varifyUser(String varificationCode) {
        ApplicationUser appUser = userRepository.findByVarificationCode(varificationCode).get();

        if(appUser != null)
        {
            appUser.setEnabled(true);
        }

        userRepository.save(appUser);

        return appUser;

    }

        private UserDetails buildAdminUser(String username) {
        // Admin users should have roles like ROLE_ADMIN, you can customize this as needed
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String encodedPassword = encoder.encode("123456");
        return User.builder()
                .username(username)
                .password(encodedPassword) // Using {noop} to indicate the password is stored in plain text
                .authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))
                .build();
    }

}
