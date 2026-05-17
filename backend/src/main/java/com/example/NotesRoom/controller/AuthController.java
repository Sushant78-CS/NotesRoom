package com.example.NotesRoom.controller;

import com.example.NotesRoom.dto.*;
import com.example.NotesRoom.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        AuthResponseDto login = authService.login(loginRequestDto);

        return ResponseEntity.ok(login);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@RequestBody LoginRequestDto signupRequestDto) {
        AuthResponseDto signupUser = authService.signup(signupRequestDto);

        return ResponseEntity.ok(signupUser);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(@RequestBody RefreshRequestDto refreshToken) {
        AuthResponseDto loginResponseDto = authService.refreshToken(refreshToken.getRefreshToken());

        return ResponseEntity.ok(loginResponseDto);
    }

    @GetMapping("/abc")
    public String greet() {
        return "Hello Sushant";
    }

}
