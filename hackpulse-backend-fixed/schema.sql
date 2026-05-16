-- ============================================================
-- HackPulse Database Schema  (updated — dynamic judge + team assignment)
-- ============================================================

CREATE DATABASE IF NOT EXISTS hackpulse_db;
USE hackpulse_db;

-- Users
-- team_id links a PARTICIPANT to their team so /api/users/me/team works
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL UNIQUE,
    password   VARCHAR(255)  NOT NULL,
    role       ENUM('PARTICIPANT','JUDGE','ADMIN') NOT NULL DEFAULT 'PARTICIPANT',
    team_id    BIGINT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_name     VARCHAR(100) NOT NULL UNIQUE,
    project_title VARCHAR(150) NOT NULL,
    description   TEXT,
    tech_stack    VARCHAR(500),
    github_url    VARCHAR(300),
    demo_url      VARCHAR(300),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add FK after both tables exist (safe with ALTER IF NOT EXISTS)
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS fk_user_team
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    role    VARCHAR(60),
    avatar  VARCHAR(10),
    team_id BIGINT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Submissions
-- judge_email stores the email of the assigned judge for filtered /my-assignments queries
CREATE TABLE IF NOT EXISTS submissions (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id      BIGINT NOT NULL UNIQUE,
    status       ENUM('SUBMITTED','UNDER_REVIEW','EVALUATED','DISQUALIFIED') NOT NULL DEFAULT 'SUBMITTED',
    score        DECIMAL(5,2),
    judge        VARCHAR(100),
    judge_email  VARCHAR(150),
    remarks      TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- ============================================================
-- Seed data
-- Passwords: all "password123" (BCrypt hash)
-- ============================================================

INSERT IGNORE INTO teams (id, team_name, project_title, description, tech_stack, github_url, demo_url) VALUES
(1, 'Neural Ninjas', 'MediScan AI',   'AI-powered medical image analysis using deep learning.',       'React,Python,TensorFlow,FastAPI,PostgreSQL', 'https://github.com', 'https://demo.io'),
(2, 'ByteForge',     'EcoTrack',      'Real-time carbon footprint tracker for organizations.',         'Vue.js,Node.js,MongoDB,Chart.js,AWS S3',     'https://github.com', 'https://demo.io'),
(3, 'Quantum Leap',  'FinFlow',       'Intelligent cash flow prediction system for SMBs.',             'Angular,Spring Boot,MySQL,Docker',           'https://github.com', 'https://demo.io'),
(4, 'CodeCraft',     'SmartCampus',   'IoT-based smart campus system for resource monitoring.',        'React,FastAPI,PostgreSQL,MQTT,Arduino',      'https://github.com', 'https://demo.io'),
(5, 'DevDragons',    'GreenGrid',     'Renewable energy grid optimizer using predictive analytics.',   'Next.js,Prisma,Redis,Python,TensorFlow',     'https://github.com', 'https://demo.io');

INSERT IGNORE INTO users (id, name, email, password, role, team_id) VALUES
-- BCrypt hash of "password123"
(1,  'Admin User',       'admin@hackpulse.io',   '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'ADMIN',       NULL),
(2,  'Dr. Anjali Verma', 'anjali@hackpulse.io',  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'JUDGE',       NULL),
(3,  'Prof. Ravi Kumar', 'ravi@hackpulse.io',    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'JUDGE',       NULL),
(4,  'Arjun Sharma',     'arjun@hackpulse.io',   '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'PARTICIPANT', 1),
(5,  'Priya Mehta',      'priya@hackpulse.io',   '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'PARTICIPANT', 1),
(6,  'Aditya Singh',     'aditya@hackpulse.io',  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'PARTICIPANT', 2),
(7,  'Kavya Nair',       'kavya@hackpulse.io',   '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'PARTICIPANT', 2),
(8,  'Rahul Gupta',      'rahul@hackpulse.io',   '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'PARTICIPANT', 3);

INSERT IGNORE INTO team_members (name, role, avatar, team_id) VALUES
('Arjun Sharma',    'Team Lead',    'AS', 1), ('Priya Mehta',     'ML Engineer',  'PM', 1),
('Rohan Das',       'Backend Dev',  'RD', 1), ('Sneha Kulkarni',  'UI/UX',        'SK', 1),
('Aditya Singh',    'Team Lead',    'AD', 2), ('Kavya Nair',      'Full Stack',   'KN', 2),
('Vivek Patel',     'Data Analyst', 'VP', 2),
('Rahul Gupta',     'Team Lead',    'RG', 3), ('Ananya Roy',      'Frontend',     'AR', 3),
('Siddharth Joshi', 'Backend',      'SJ', 3),
('Dev Anand',       'Team Lead',    'DA', 4), ('Riya Bose',       'Backend',      'RB', 4),
('Lakshmi R',       'Team Lead',    'LR', 5), ('Kiran M',         'ML Engineer',  'KM', 5);

-- Submissions with judge_email for dynamic assignment filtering
INSERT IGNORE INTO submissions (team_id, status, score, judge, judge_email, remarks) VALUES
(1, 'EVALUATED',   96.5, 'Dr. Anjali Verma', 'anjali@hackpulse.io', 'Exceptional model accuracy and production-ready UI.'),
(2, 'EVALUATED',   93.2, 'Prof. Ravi Kumar',  'ravi@hackpulse.io',   'Great visualizations, needs better mobile responsiveness.'),
(3, 'EVALUATED',   91.8, 'Dr. Anjali Verma', 'anjali@hackpulse.io', 'Enterprise-ready solution with excellent DevOps setup.'),
(4, 'UNDER_REVIEW', NULL, 'Dr. Anjali Verma', 'anjali@hackpulse.io', ''),
(5, 'UNDER_REVIEW', NULL, 'Prof. Ravi Kumar',  'ravi@hackpulse.io',   '');
