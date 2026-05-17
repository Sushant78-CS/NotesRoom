package com.example.NotesRoom.service;

import com.example.NotesRoom.dto.*;
import com.example.NotesRoom.dto.type.RoleType;
import com.example.NotesRoom.entity.RefreshToken;
import com.example.NotesRoom.entity.Users;
import com.example.NotesRoom.repository.RefreshTokenRepository;
import com.example.NotesRoom.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-ttl}")
    private long refreshTtlSeconds;

    public AuthResponseDto login(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword())
        );
        Users user = (Users) authentication.getPrincipal();

        String jti = UUID.randomUUID().toString();
        RefreshToken refreshTokenOb = RefreshToken.builder()
                .jti(jti)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(refreshTtlSeconds))
                .user(user)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshTokenOb);

        String token = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user, refreshTokenOb.getJti());

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());

        return new AuthResponseDto(token, refreshToken, userDto);

    }

    public AuthResponseDto refreshToken(String refreshToken) {

        Claims claims;
        try {
            claims = jwtService.extractClaims(refreshToken);
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Refresh token expired", e);
        }
//        Claims claims = jwtService.extractClaims(refreshToken);

        if (!"refresh".equals(claims.get("typ"))) {
            throw new RuntimeException("Invalid token type");
        }

        String userId = claims.getSubject();
        String jti = claims.getId();

        RefreshToken tokenInDb = refreshTokenRepository.findByJti(jti)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (tokenInDb.isRevoked()) {
            throw new RuntimeException("Token revoked");
        }

        if (tokenInDb.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }

        Users user = tokenInDb.getUser();

        String newAccessToken = jwtService.generateAccessToken(user);

        tokenInDb.setRevoked(true);
        refreshTokenRepository.save(tokenInDb);

        String newJti = UUID.randomUUID().toString();

        RefreshToken newrefreshToken = RefreshToken.builder()
                .jti(newJti)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(refreshTtlSeconds))
                .user(user)
                .revoked(false)
                .build();

        refreshTokenRepository.save(newrefreshToken);

        String newRefreshToken1 = jwtService.generateRefreshToken(user, newJti);

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setRole(user.getRole());

        return new AuthResponseDto(newAccessToken, newRefreshToken1, userDto);
    }

    public AuthResponseDto signup(LoginRequestDto signupRequestDto) {
        Users users = Users.builder()
                .username(signupRequestDto.getUsername())
                .password(passwordEncoder.encode(signupRequestDto.getPassword()))
                .role(RoleType.ROLE_USER)
                .build();

        Users savedUser = userRepository.save(users);

        String jti = UUID.randomUUID().toString();

        RefreshToken refreshTokenOb = RefreshToken.builder()
                .jti(jti)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(refreshTtlSeconds))
                .user(savedUser)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshTokenOb);

        String accessToken = jwtService.generateAccessToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser, jti);

        UserDto userDto = new UserDto();
        userDto.setId(savedUser.getId());
        userDto.setUsername(savedUser.getUsername());
        userDto.setRole(savedUser.getRole());

        return new AuthResponseDto(accessToken, refreshToken, userDto);
    }


}
