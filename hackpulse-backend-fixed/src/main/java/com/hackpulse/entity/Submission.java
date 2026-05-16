package com.hackpulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false, unique = true)
    private Team team;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private Double score;

    /** Display name of the judge who reviewed this submission */
    private String judge;

    /**
     * Email of the judge assigned to this submission.
     * Used for filtering submissions by judge identity.
     */
    @Column(name = "judge_email")
    private String judgeEmail;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) submittedAt = LocalDateTime.now();
        if (status == null) status = Status.SUBMITTED;
    }

    public enum Status { SUBMITTED, UNDER_REVIEW, EVALUATED, DISQUALIFIED }

    public Submission() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public String getJudge() { return judge; }
    public void setJudge(String judge) { this.judge = judge; }
    public String getJudgeEmail() { return judgeEmail; }
    public void setJudgeEmail(String judgeEmail) { this.judgeEmail = judgeEmail; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime v) { this.submittedAt = v; }
}
