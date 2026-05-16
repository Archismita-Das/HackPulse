package com.hackpulse.controller;

import com.hackpulse.entity.Submission;
import com.hackpulse.service.SubmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    /** Admin: get all submissions */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','JUDGE')")
    public ResponseEntity<?> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    /**
     * Judge: get submissions assigned to the currently logged-in judge.
     * Uses JWT subject (email) to filter.
     */
    @GetMapping("/my-assignments")
    @PreAuthorize("hasRole('JUDGE')")
    public ResponseEntity<?> getMyAssignments(Authentication auth) {
        String judgeEmail = auth.getName(); // JWT subject = email
        return ResponseEntity.ok(submissionService.getSubmissionsForJudge(judgeEmail));
    }

    /** Participant/Admin: get submission for a specific team */
    @GetMapping("/team/{teamId}")
    public ResponseEntity<?> getByTeam(@PathVariable Long teamId) {
        try {
            return ResponseEntity.ok(submissionService.getSubmissionByTeam(teamId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** Participant: submit their team's project */
    @PostMapping("/team/{teamId}")
    public ResponseEntity<?> submit(@PathVariable Long teamId, @RequestBody Submission submission) {
        try {
            return ResponseEntity.ok(submissionService.createSubmission(teamId, submission));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Judge/Admin: score a submission.
     * Judge email is taken from the JWT token, not from the request body.
     */
    @PutMapping("/{id}/score")
    @PreAuthorize("hasAnyRole('JUDGE','ADMIN')")
    public ResponseEntity<?> scoreSubmission(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        try {
            Double score = Double.parseDouble(payload.get("score").toString());
            String remarks = payload.getOrDefault("remarks", "").toString();
            // Judge name comes from payload (display), email comes from JWT
            String judgeName = payload.getOrDefault("judgeName", auth.getName()).toString();
            String judgeEmail = auth.getName(); // always use JWT email, not payload
            return ResponseEntity.ok(submissionService.scoreSubmission(id, score, remarks, judgeName, judgeEmail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Admin: assign a judge to a submission.
     */
    @PutMapping("/{id}/assign-judge")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignJudge(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        try {
            String judgeName = payload.get("judgeName");
            String judgeEmail = payload.get("judgeEmail");
            return ResponseEntity.ok(submissionService.assignJudge(id, judgeName, judgeEmail));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
