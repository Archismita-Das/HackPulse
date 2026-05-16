package com.hackpulse.controller;

import com.hackpulse.repository.SubmissionRepository;
import com.hackpulse.repository.TeamRepository;
import com.hackpulse.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final SubmissionRepository submissionRepository;

    public StatsController(UserRepository userRepository, TeamRepository teamRepository, SubmissionRepository submissionRepository) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.submissionRepository = submissionRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<?> summary() {
        long totalParticipants = userRepository.count();
        long activeTeams = teamRepository.count();
        long totalSubmissions = submissionRepository.count();
        Double avgScore = submissionRepository.findAverageScore();
        return ResponseEntity.ok(Map.of(
            "totalParticipants", totalParticipants,
            "activeTeams", activeTeams,
            "totalSubmissions", totalSubmissions,
            "averageScore", avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0.0
        ));
    }
}
