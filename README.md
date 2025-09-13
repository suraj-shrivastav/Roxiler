# Roxiler System - Rating Assignment

A Full Stack Web Application developed as part of the Roxiler Systems FullStack Intern Coding Challenge. The platform allows users to register, submit ratings for stores, and manage operations through role-based access control.

## Project Overview

The Roxiler Rating System enables users to rate stores (1–5 stars), explore stores by name or address, and interact with the platform based on their roles. The platform offers:

- Clean architecture with modular components
- Secure authentication and password validation
- Responsive UI/UX for seamless interaction
- Robust data handling with efficient filtering and sorting

Roles include System Administrator, Normal User, and Store Owner, each with tailored permissions.

## Tech Stack

- **Backend:** Express.js
- **Database:** MySQL
- **Frontend:** React.js

## User Roles & Permissions

### Demo Credentials:

#### Admin
- **Email:** roxiler_admin@gmail.com
- **Password:** Roxiler@123

**Capabilities:**
- Create and manage stores and users (normal and admin)
- View dashboards showing total users, stores, and ratings
- Filter, search, and manage users and stores
- Access detailed user and store information

#### Store Owner
- **Email:** roxiler_store@gmail.com
- **Password:** Roxiler@123

**Capabilities:**
- Log in and update password
- View users who rated their store
- Check average store rating

#### Normal User
- **Email:** roxiler_user@gmail.com
- **Password:** Roxiler@123

**Capabilities:**
- Sign up and log in
- Browse and search stores by name or address
- Submit and edit ratings (1–5)
- Update password securely

## Key Features

- Role-based authentication and authorization
- Store and user management with sorting and filtering
- Ratings submission and real-time updates
- Secure password handling with robust validation
- Responsive and intuitive UI/UX design
- Clean database schema and modular architecture

## Form Validation Rules

- **Name:** 20–60 characters
- **Address:** Up to 400 characters
- **Password:** 8–16 characters, must include at least one uppercase letter and one special character
- **Email:** Must follow standard format

## Additional Notes

- Tables support sorting (ascending/descending) by fields like name, email, and address
- Clean and modular code structure
- Database design follows normalization principles
- Secure handling of passwords and user sessions

## Setup Instructions

### 1️⃣ Configure Environment Variables

Create a `.env` file in the backend folder with the following content:

```env
PORT=5000
DB_HOST=host_name
DB_USER=user_name
DB_PASS=your_password
DB_NAME=rating_system
JWT_SECRET=your_jwt_secret_key
```

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/suraj-shrivastav/Roxiler.git
```

### 3️⃣ Install and Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Access the frontend at: [http://localhost:5173](http://localhost:5173)

### 4️⃣ Install and Run the Backend

```bash
cd backend
npm install
npm start
```

Access the backend API at: [http://localhost:5000](http://localhost:5000)

## API Endpoints

### **Authentication**

* `POST /api/auth/signup` - User registration
* `POST /api/auth/login` - User login
* `POST /api/auth/logout` - User logout
* `PUT /api/auth/update-password` - Update user password
* `GET /api/auth/check` - Check authentication status

### **Admin** (Admin only)

* `POST /api/admin/stores` - Create new store
* `POST /api/admin/users` - Create new user
* `GET /api/admin/dashboard` - Get admin dashboard data

### **Store Owner** (Store Owner only)

* `GET /api/owner/dashboard` - Get store ratings and user data

### **Users** (User only)

* `GET /api/user/stores` - Get all stores with filtering and search
* `POST /api/user/stores/:id/rating` - Submit rating for a store
* `PUT /api/user/stores/:id/rating` - Update existing rating for a store
