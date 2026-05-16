package com.hackpulse.dto;

import com.hackpulse.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDto {

    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank
        private String name;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
        private User.Role role = User.Role.PARTICIPANT;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }

    public static class AuthResponse {
        private String token;
        private UserInfo user;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public UserInfo getUser() { return user; }
        public void setUser(UserInfo user) { this.user = user; }

        public static class UserInfo {
            private Long id;
            private String name;
            private String email;
            private String role;
            /** Null for non-participants; populated for participants who are in a team */
            private Long teamId;

            public Long getId() { return id; }
            public void setId(Long id) { this.id = id; }
            public String getName() { return name; }
            public void setName(String name) { this.name = name; }
            public String getEmail() { return email; }
            public void setEmail(String email) { this.email = email; }
            public String getRole() { return role; }
            public void setRole(String role) { this.role = role; }
            public Long getTeamId() { return teamId; }
            public void setTeamId(Long teamId) { this.teamId = teamId; }
        }
    }
}
