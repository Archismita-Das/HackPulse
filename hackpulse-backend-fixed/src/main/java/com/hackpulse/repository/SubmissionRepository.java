package com.hackpulse.repository;

import com.hackpulse.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    Optional<Submission> findByTeamId(Long teamId);

    /** All submissions assigned to this judge by their email */
    List<Submission> findByJudgeEmail(String judgeEmail);

    /** Submissions not yet assigned to any judge */
    List<Submission> findByJudgeEmailIsNull();

    @Query("SELECT AVG(s.score) FROM Submission s WHERE s.score IS NOT NULL")
    Double findAverageScore();

    List<Submission> findAllByOrderByScoreDesc();
}
