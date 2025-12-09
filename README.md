# 🎬 Film Recommendation App

Full-stack Film Catalog & Personal Watchlist Application
(Built with React + Spring Boot + JWT Security)

## 🚀 Overview
- This project is a full-stack film recommendation platform that allows users to:
- Browse globally available movies
- Filter & search movies by multiple criteria
- Manage their own personal movie list
- Edit / delete films from their private list
- Administrators can manage users, global films, and categories
- Modern cyberpunk / neon-styled UI with animations

## The application consists of:
Frontend: React (Vite) + MUI + custom neon UI
Backend: Spring Boot + Spring Security + JWT + H2 database
API: RESTful JSON endpoints
Auth: Role-based (User / Admin)


## ⚙️ Tech Stack

### Frontend:
React (Vite)
React Router
Axios
Material UI
Custom CSS (neon cyberpunk theme)
Dynamic canvas animations (JS)

### Backend:
Spring Boot 3.x
Spring Security 7
JWT Authentication
H2 Database (in-memory)
Spring Data JPA
REST API


## 📌 Features

### 👤 User
Register / Login / Logout
Browse movies
Filter by title, director, category, years
Add movies to personal list
Edit or delete own movies
Neon-styled UI and animations

### 🔐 Admin
Manage global films
Create / update / delete categories
Manage users
Add films with descriptions, posters, ratings

### 🎨 UI / UX
Custom neon cyberpunk theme
Animated background (moving neon particles)
Responsive layout
Modern button & card components


## 🛠 Setup Instructions (for local run)

git clone 
cd film-recommendation-app

### Backend
cd backend
mvn spring-boot:run
Backend will start on: http://localhost:8080

### Frontend
cd frontend
npm install
npm run dev
Frontend will start on: http://localhost:5173



