package com.hackpulse.controller;

import com.hackpulse.entity.User;
import com.hackpulse.repository.UserRepository;
import com.hackpulse.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final TeamService teamService;

    public UserController(UserRepository userRepository, TeamService teamService) {
        this.userRepository = userRepository;
        this.teamService = teamService;
    }

    /**
     * Returns the logged-in user's profile.
     * Includes teamId if they are a participant assigned to a team.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of(
            "id",     user.getId(),
            "name",   user.getName(),
            "email",  user.getEmail(),
            "role",   user.getRole().name().toLowerCase(),
            "teamId", user.getTeam() != null ? user.getTeam().getId() : null
        ));
    }

    /**
     * Returns full team details for the currently logged-in participant.
     * Convenience endpoint so the participant doesn't need to know their teamId first.
     */
    @GetMapping("/me/team")
    @PreAuthorize("hasRole('PARTICIPANT')")
    public ResponseEntity<?> getMyTeam(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        if (user.getTeam() == null) {
            return ResponseEntity.ok(Map.of("message", "not_in_team"));
        }
        return ResponseEntity.ok(teamService.getTeamById(user.getTeam().getId()));
    }

    /**
     * Admin: get all users
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll().stream().map(u ->
            Map.<String, Object>of(
                "id",     u.getId(),
                "name",   u.getName(),
                "email",  u.getEmail(),
                "role",   u.getRole().name().toLowerCase(),
                "teamId", u.getTeam() != null ? u.getTeam().getId() : null,
                "teamName", u.getTeam() != null ? u.getTeam().getTeamName() : ""
            )
        ).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
}
