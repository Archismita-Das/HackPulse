package com.hackpulse.controller;

import com.hackpulse.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final TeamService teamService;

    public LeaderboardController(TeamService teamService) { this.teamService = teamService; }

    @GetMapping
    public ResponseEntity<?> getLeaderboard() { return ResponseEntity.ok(teamService.getLeaderboard()); }
}
