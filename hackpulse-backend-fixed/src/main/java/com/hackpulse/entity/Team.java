package com.hackpulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "team_name", nullable = false, unique = true)
    private String teamName;

    @Column(name = "project_title", nullable = false)
    private String projectTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "tech_stack")
    private String techStack;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "demo_url")
    private String demoUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TeamMember> members;

    @OneToOne(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Submission submission;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public Team() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String v) { this.teamName = v; }
    public String getProjectTitle() { return projectTitle; }
    public void setProjectTitle(String v) { this.projectTitle = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public String getTechStack() { return techStack; }
    public void setTechStack(String v) { this.techStack = v; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String v) { this.githubUrl = v; }
    public String getDemoUrl() { return demoUrl; }
    public void setDemoUrl(String v) { this.demoUrl = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    public List<TeamMember> getMembers() { return members; }
    public void setMembers(List<TeamMember> v) { this.members = v; }
    public Submission getSubmission() { return submission; }
    public void setSubmission(Submission v) { this.submission = v; }
}
