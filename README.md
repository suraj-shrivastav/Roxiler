# Roxiler System - Rating Assignment

This project is a Full Stack Web Application developed as part of the Roxiler Systems FullStack Intern Coding Challenge. The platform enables users to register, submit ratings for stores, and manage operations through role-based access control.

---

## Project Overview

The Roxiler Rating System allows users to rate stores (1 to 5 stars) and interact with the platform according to their roles. System Administrators, Normal Users, and Store Owners have distinct functionalities such as managing users, viewing dashboards, submitting and editing ratings, and filtering data efficiently.

This project emphasizes clean architecture, secure authentication, and responsive design.

---

## Tech Stack

- Backend: Express.js / Loopback / NestJS (one option)
- Database: PostgreSQL / MySQL
- Frontend: React.js

---

## User Roles & Permissions

### System Administrator
- Create new stores, users (normal and admin)
- View dashboards showing:
  - Total users
  - Total stores
  - Total ratings submitted
- Filter and manage lists of users and stores
- Access detailed user information including name, email, address, and role
- View store ratings and owner details

### Normal User
- Sign up and log in
- Browse all stores with their ratings
- Search stores by name or address
- Submit or edit ratings (1–5)
- Update their password securely

### Store Owner
- Log in and update their password
- View users who rated their store
- See their store’s average rating at a glance

---

## Key Features

- Role-based authentication and authorization
- Store and user management with filtering and sorting
- Ratings submission and modification with real-time updates
- Secure password handling with robust validation
- Responsive and intuitive UI/UX design
- Best practices for database schema and code structure

---

## Form Validation Rules

- Name: 20–60 characters
- Address: Maximum 400 characters
- Password: 8–16 characters, must include at least one uppercase letter and one special character
- Email: Must follow standard format validation rules

---

## Additional Notes

- All tables support sorting (ascending/descending) by fields like name, email, and address
- Clean code and modular architecture are enforced throughout
- Database design adheres to normalization principles and best practices

---

## Setup Instructions

### Create a `.env` file in the backend folder with the following details:

PORT=5000

DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=admin
DB_NAME=rating_system

JWT_SECRET=your_jwt_secret_key

### Clone the repository:

git clone https://github.com/suraj-shrivastav/Roxiler.git

### Install dependencies and run the frontend:

cd frontend
npm install
npm run dev

Access the frontend at `http://localhost:5173`.

### Install dependencies and run the backend:

cd backend
npm install
npm start

yaml
Copy code

Access the backend API at `http://localhost:5000`.

---
