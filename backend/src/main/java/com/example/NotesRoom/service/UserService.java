package com.example.NotesRoom.service;

import com.example.NotesRoom.dto.LoginRequestDto;
import com.example.NotesRoom.dto.LoginResponseDto;
import com.example.NotesRoom.dto.SignupResponseDto;
import com.example.NotesRoom.dto.type.RoleType;
import com.example.NotesRoom.entity.Users;
import com.example.NotesRoom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${Admin_Password}")
    private String secretCode;

    public Users becomeAdmin(String code) {
        System.out.println("SERVICE HIT");
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof UserDetails)) {
            throw new RuntimeException("Invalid principal");
        }

        UserDetails userDetails = ((UserDetails) principal);
        Users users = userRepository.findByUsername(userDetails.getUsername());

        if (users == null) {
            throw new RuntimeException("User not authenticated");
        }
        if (!code.equals(secretCode)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid admin code");
        }
        if (users.getRole() == RoleType.ROLE_ADMIN) {
            throw new RuntimeException("Already an Admin");
        }
        Users usersFromDb = userRepository.findById(users.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        usersFromDb.setRole(RoleType.ROLE_ADMIN);
        Users savedUser = userRepository.save(usersFromDb);
        return savedUser;
    }



}
