package com.hackpulse.controller;

import com.hackpulse.entity.Team;
import com.hackpulse.entity.User;
import com.hackpulse.repository.UserRepository;
import com.hackpulse.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;
    private final UserRepository userRepository;

    public TeamController(TeamService teamService, UserRepository userRepository) {
        this.teamService = teamService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeam(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(teamService.getTeamById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTeam(@RequestBody Team team) {
        try {
            return ResponseEntity.ok(teamService.createTeam(team));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody Team team) {
        try {
            return ResponseEntity.ok(teamService.updateTeam(id, team));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Admin: assign a user (participant) to a team.
     * Body: { "userId": 123 }
     */
    @PostMapping("/{teamId}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addMemberToTeam(
            @PathVariable Long teamId,
            @RequestBody Map<String, Long> body) {
        try {
            Long userId = body.get("userId");
            teamService.assignUserToTeam(userId, teamId);
            return ResponseEntity.ok(Map.of("message", "User assigned to team"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
