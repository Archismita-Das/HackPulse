package com.hackpulse.service;

import com.hackpulse.entity.Team;
import com.hackpulse.entity.User;
import com.hackpulse.repository.TeamRepository;
import com.hackpulse.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    public List<Map<String, Object>> getLeaderboard() {
        List<Team> teams = teamRepository.findAllOrderByScoreDesc();
        AtomicInteger rank = new AtomicInteger(1);
        return teams.stream()
                .map(t -> toLeaderboardEntry(t, rank.getAndIncrement()))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllTeams() {
        List<Team> teams = teamRepository.findAllOrderByScoreDesc();
        AtomicInteger rank = new AtomicInteger(1);
        return teams.stream()
                .map(t -> toTeamDetail(t, rank.getAndIncrement()))
                .collect(Collectors.toList());
    }

    public Map<String, Object> getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        List<Team> all = teamRepository.findAllOrderByScoreDesc();
        int rank = all.indexOf(team) + 1;
        return toTeamDetail(team, rank);
    }

    @Transactional
    public Team createTeam(Team team) {
        if (teamRepository.existsByTeamName(team.getTeamName())) {
            throw new IllegalArgumentException("Team name already taken");
        }
        return teamRepository.save(team);
    }

    @Transactional
    public Team updateTeam(Long id, Team updates) {
        Team existing = teamRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        existing.setTeamName(updates.getTeamName());
        existing.setProjectTitle(updates.getProjectTitle());
        existing.setDescription(updates.getDescription());
        existing.setTechStack(updates.getTechStack());
        existing.setGithubUrl(updates.getGithubUrl());
        existing.setDemoUrl(updates.getDemoUrl());
        return teamRepository.save(existing);
    }

    @Transactional
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    /**
     * Assign a participant user to a team.
     * This links user.teamId = team.id so /api/users/me/team works correctly.
     */
    @Transactional
    public void assignUserToTeam(Long userId, Long teamId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        user.setTeam(team);
        userRepository.save(user);
    }

    private Map<String, Object> toLeaderboardEntry(Team t, int rank) {
        var sub = t.getSubmission();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("rank", rank);
        map.put("teamName", t.getTeamName());
        map.put("projectTitle", t.getProjectTitle());
        map.put("members", t.getMembers() != null ? t.getMembers().size() : 0);
        map.put("score", sub != null && sub.getScore() != null ? sub.getScore() : 0);
        map.put("status", sub != null ? sub.getStatus().name().replace("_", " ") : "Submitted");
        return map;
    }

    private Map<String, Object> toTeamDetail(Team t, int rank) {
        var sub = t.getSubmission();
        List<String> techList = t.getTechStack() != null
                ? Arrays.asList(t.getTechStack().split(","))
                : List.of();
        List<Map<String, String>> memberList = t.getMembers() != null
                ? t.getMembers().stream().map(m -> {
                    Map<String, String> mm = new LinkedHashMap<>();
                    mm.put("name", m.getName());
                    mm.put("role", m.getRole());
                    mm.put("avatar", m.getAvatar());
                    return mm;
                  }).collect(Collectors.toList())
                : List.of();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", t.getId());
        map.put("rank", rank);
        map.put("teamName", t.getTeamName());
        map.put("projectTitle", t.getProjectTitle());
        map.put("description", t.getDescription() != null ? t.getDescription() : "");
        map.put("techStack", techList);
        map.put("members", memberList);
        map.put("githubUrl", t.getGithubUrl() != null ? t.getGithubUrl() : "");
        map.put("demoUrl", t.getDemoUrl() != null ? t.getDemoUrl() : "");
        map.put("score", sub != null && sub.getScore() != null ? sub.getScore() : 0);
        map.put("submissionStatus", sub != null ? sub.getStatus().name().replace("_", " ") : "Not Submitted");
        map.put("remarks", sub != null && sub.getRemarks() != null ? sub.getRemarks() : "");
        return map;
    }
}
