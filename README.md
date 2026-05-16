# HackPulse 🚀

HackPulse is a full-stack hackathon leaderboard and evaluation platform designed to streamline hackathon management, participant evaluation, and leaderboard tracking.

Built using React, Spring Boot, and MySQL, the platform provides role-based dashboards for Admins, Judges, and Participants with a modern responsive UI and secure authentication workflows.

---

# ✨ Features

## 👨‍💼 Admin Dashboard

* Manage teams and participants
* Assign judges
* Monitor submissions
* Edit scores and rankings
* View platform analytics

## ⚖️ Judge Dashboard

* Evaluate team submissions
* Assign scores and remarks
* Track pending evaluations
* Review submitted projects

## 👨‍💻 Participant Dashboard

* View leaderboard rankings
* Monitor team performance
* Access submission details
* Track scores and evaluation status

## 🏆 Leaderboard System

* Dynamic team rankings
* Score visualization
* Performance analytics
* Real-time leaderboard UI

## 🔐 Authentication

* JWT-based authentication
* Role-based access control
* Secure login workflows

## 🎨 UI/UX

* Responsive modern design
* Dark/Light theme toggle
* Animated interactions using Framer Motion
* Professional dashboard layout

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Framer Motion
* React Router
* Context API

## Backend

* Spring Boot
* Java
* JWT Authentication
* REST APIs

## Database

* MySQL

---

# 📂 Project Structure

```bash
HackPulse/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── application.properties
│
├── database/
│   └── schema.sql
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Archismita-Das/HackPulse.git
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 3️⃣ Backend Setup

Open backend folder in IntelliJ IDEA.

Update database credentials inside:

```properties
application.properties
```

Then run the Spring Boot application.

---

## 4️⃣ Database Setup

* Create a MySQL database
* Import the provided SQL file
* Update database username/password in backend configuration


# 🎯 Project Objective

The objective of HackPulse is to simulate a real-world hackathon management ecosystem where organizers, judges, and participants can interact through a centralized operational platform.

The system focuses on:

* Workflow coordination
* Evaluation management
* Score tracking
* Team ranking visualization
* User experience optimization

---

# 👩‍💻 Developed By

Archismita Das

---

# 📌 Future Improvements

* Real-time leaderboard updates
* Email notifications
* Live judge comments
* Deployment support
* Advanced analytics

---

# ⭐ Acknowledgements

This project was developed as part of a Full Stack Development Internship/Hackathon Project focusing on scalable frontend-backend integration and operational workflow systems.
