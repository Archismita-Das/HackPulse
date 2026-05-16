package com.hackpulse.repository;

import com.hackpulse.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {

    boolean existsByTeamName(String teamName);

    // Fetch teams with their submission score for leaderboard, ordered by score desc
    @Query("SELECT t FROM Team t LEFT JOIN t.submission s ORDER BY COALESCE(s.score, 0) DESC")
    List<Team> findAllOrderByScoreDesc();
}
