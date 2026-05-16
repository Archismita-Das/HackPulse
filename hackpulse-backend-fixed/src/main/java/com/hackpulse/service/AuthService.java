package com.hackpulse.service;

import com.hackpulse.dto.AuthDto;
import com.hackpulse.entity.User;
import com.hackpulse.repository.UserRepository;
import com.hackpulse.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole() != null ? req.getRole() : User.Role.PARTICIPANT)
                .build();
        user = userRepository.save(user);
        return buildResponse(user);
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        return buildResponse(user);
    }

    private AuthDto.AuthResponse buildResponse(User user) {
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        AuthDto.AuthResponse.UserInfo info = new AuthDto.AuthResponse.UserInfo();
        info.setId(user.getId());
        info.setName(user.getName());
        info.setEmail(user.getEmail());
        info.setRole(user.getRole().name().toLowerCase());
        // Include teamId so the frontend immediately knows the participant's team
        info.setTeamId(user.getTeam() != null ? user.getTeam().getId() : null);
        AuthDto.AuthResponse response = new AuthDto.AuthResponse();
        response.setToken(token);
        response.setUser(info);
        return response;
    }
}
