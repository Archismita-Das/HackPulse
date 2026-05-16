package com.hackpulse.service;

import com.hackpulse.entity.Submission;
import com.hackpulse.entity.Team;
import com.hackpulse.repository.SubmissionRepository;
import com.hackpulse.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final TeamRepository teamRepository;

    public SubmissionService(SubmissionRepository submissionRepository, TeamRepository teamRepository) {
        this.submissionRepository = submissionRepository;
        this.teamRepository = teamRepository;
    }

    /** All submissions (admin view), sorted by score desc */
    public List<Map<String, Object>> getAllSubmissions() {
        return submissionRepository.findAllByOrderByScoreDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    /** Get submission for a specific team */
    public Map<String, Object> getSubmissionByTeam(Long teamId) {
        Submission sub = submissionRepository.findByTeamId(teamId)
                .orElseThrow(() -> new IllegalArgumentException("No submission for team " + teamId));
        return toDto(sub);
    }

    /**
     * Get submissions assigned to a specific judge by their email.
     * Returns assigned submissions + any unassigned ones (so judges see a full queue).
     */
    public List<Map<String, Object>> getSubmissionsForJudge(String judgeEmail) {
        List<Submission> assigned = submissionRepository.findByJudgeEmail(judgeEmail);
        List<Submission> unassigned = submissionRepository.findByJudgeEmailIsNull();
        // Combine: assigned first, then unassigned
        List<Submission> combined = new ArrayList<>();
        combined.addAll(assigned);
        combined.addAll(unassigned);
        return combined.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public Submission createSubmission(Long teamId, Submission submission) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        // Check if submission already exists; if so, update it
        Optional<Submission> existing = submissionRepository.findByTeamId(teamId);
        if (existing.isPresent()) {
            Submission s = existing.get();
            s.setStatus(Submission.Status.SUBMITTED);
            return submissionRepository.save(s);
        }
        submission.setTeam(team);
        submission.setStatus(Submission.Status.SUBMITTED);
        return submissionRepository.save(submission);
    }

    @Transactional
    public Submission scoreSubmission(Long id, Double score, String remarks, String judgeName, String judgeEmail) {
        Submission sub = submissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        sub.setScore(score);
        sub.setRemarks(remarks);
        sub.setJudge(judgeName);
        sub.setJudgeEmail(judgeEmail);
        sub.setStatus(Submission.Status.EVALUATED);
        return submissionRepository.save(sub);
    }

    /**
     * Assign a judge to a submission (admin only).
     * Sets both judgeEmail (for filtering) and judge display name.
     */
    @Transactional
    public Submission assignJudge(Long submissionId, String judgeName, String judgeEmail) {
        Submission sub = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        sub.setJudge(judgeName);
        sub.setJudgeEmail(judgeEmail);
        if (sub.getStatus() == Submission.Status.SUBMITTED) {
            sub.setStatus(Submission.Status.UNDER_REVIEW);
        }
        return submissionRepository.save(sub);
    }

    private Map<String, Object> toDto(Submission s) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", s.getId());
        map.put("teamName", s.getTeam().getTeamName());
        map.put("projectTitle", s.getTeam().getProjectTitle());
        map.put("description", s.getTeam().getDescription() != null ? s.getTeam().getDescription() : "");
        map.put("githubUrl", s.getTeam().getGithubUrl() != null ? s.getTeam().getGithubUrl() : "");
        map.put("demoUrl", s.getTeam().getDemoUrl() != null ? s.getTeam().getDemoUrl() : "");
        // Include tech stack as list
        String ts = s.getTeam().getTechStack();
        map.put("techStack", ts != null ? Arrays.asList(ts.split(",")) : List.of());
        // Include team members
        var members = s.getTeam().getMembers();
        if (members != null) {
            map.put("members", members.stream().map(m -> {
                Map<String, String> mm = new LinkedHashMap<>();
                mm.put("name", m.getName()); mm.put("role", m.getRole()); mm.put("avatar", m.getAvatar());
                return mm;
            }).collect(Collectors.toList()));
        } else {
            map.put("members", List.of());
        }
        map.put("submittedAt", s.getSubmittedAt() != null ? s.getSubmittedAt().toString().replace("T", " ") : "");
        map.put("status", s.getStatus().name().replace("_", " "));
        map.put("score", s.getScore() != null ? s.getScore() : null);
        map.put("judge", s.getJudge() != null ? s.getJudge() : "");
        map.put("judgeEmail", s.getJudgeEmail() != null ? s.getJudgeEmail() : "");
        map.put("remarks", s.getRemarks() != null ? s.getRemarks() : "");
        return map;
    }
}
