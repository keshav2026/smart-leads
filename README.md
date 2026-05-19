# 🚀 Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and Docker.

## Tech Stack

| Layer      | Tech                                         |
|------------|----------------------------------------------|
| Frontend   | React 18, TypeScript, TailwindCSS, Zustand, React Query |
| Backend    | Node.js, Express, TypeScript, MongoDB, Mongoose |
| Auth       | JWT + bcrypt                                 |
| DevOps     | Docker, Docker Compose                       |

## Features

- 🔐 JWT Authentication (Register / Login / Protected Routes)
- 👥 Role-Based Access Control (Admin / Sales)
- 📋 Full Lead CRUD (Create, Read, Update, Delete)
- 🔍 Advanced Filtering — Status, Source, Search, Sort
- ⚡ Debounced Search (400ms)
- 📄 Backend Pagination (10 per page)
- 📦 CSV Export with active filters applied
- 🌙 Dark Mode Support
- 📱 Fully Responsive UI

---

## Quick Start (Docker — Recommended)

### Prerequisites
- Docker & Docker Compose installed

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd smart-leads

# 2. Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start all services
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

---

## Local Development (Without Docker)

### Backend

```bash
cd backend
npm install
# Make sure MongoDB is running
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                        | Default                          |
|-----------------|------------------------------------|----------------------------------|
| `PORT`          | Server port                        | `5000`                           |
| `MONGO_URI`     | MongoDB connection string          | See `.env.example`               |
| `JWT_SECRET`    | JWT signing secret                 | Change in production!            |
| `JWT_EXPIRES_IN`| Token expiry                       | `7d`                             |
| `NODE_ENV`      | Environment                        | `development`                    |

### Frontend (`frontend/.env`)

| Variable             | Description       | Default                        |
|----------------------|-------------------|--------------------------------|
| `VITE_API_BASE_URL`  | Backend API URL   | `http://localhost:5000/api`    |

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints

| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| POST   | `/auth/register`   | ❌   | Register new user  |
| POST   | `/auth/login`      | ❌   | Login              |
| GET    | `/auth/me`         | ✅   | Get current user   |

#### POST `/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "sales"
}
```

#### POST `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

### Lead Endpoints

All lead routes require `Authorization: Bearer <token>` header.

| Method | Endpoint              | Role         | Description               |
|--------|-----------------------|--------------|---------------------------|
| GET    | `/leads`              | All          | List leads (paginated)    |
| GET    | `/leads/:id`          | All          | Get single lead           |
| POST   | `/leads`              | All          | Create lead               |
| PUT    | `/leads/:id`          | All          | Update lead               |
| DELETE | `/leads/:id`          | Admin only   | Delete lead               |
| GET    | `/leads/export/csv`   | All          | Export leads as CSV       |

#### GET `/leads` — Query Parameters

| Param    | Type     | Values                                | Description          |
|----------|----------|---------------------------------------|----------------------|
| `page`   | number   | `1`, `2`, ...                         | Page number          |
| `limit`  | number   | `1–50`                                | Records per page     |
| `status` | string   | `New`, `Contacted`, `Qualified`, `Lost` | Filter by status   |
| `source` | string   | `Website`, `Instagram`, `Referral`    | Filter by source     |
| `search` | string   | any                                   | Search name or email |
| `sort`   | string   | `latest`, `oldest`                    | Sort order           |

#### Response Format
```json
{
  "success": true,
  "message": "Leads retrieved",
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Project Structure

```
smart-leads/
├── docker-compose.yml
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error, validate
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routers
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # JWT, response helpers
│   │   ├── validators/     # express-validator rules
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/       # ProtectedRoute
    │   │   ├── layout/     # Navbar, Sidebar, DashboardLayout
    │   │   ├── leads/      # LeadTable, LeadForm, LeadFilters, LeadDetailModal
    │   │   └── ui/         # Button, Input, Select, Badge, Modal
    │   ├── context/        # ThemeContext (dark mode)
    │   ├── hooks/          # useLeads, useDebounce
    │   ├── pages/          # LoginPage, RegisterPage, DashboardPage, LeadsPage
    │   ├── services/       # api.ts, auth.service.ts, lead.service.ts
    │   ├── store/          # Zustand authStore
    │   └── types/          # TypeScript interfaces
    ├── Dockerfile
    └── package.json
```

---

## Role-Based Access

| Feature         | Admin | Sales User         |
|-----------------|-------|--------------------|
| View all leads  | ✅    | Own leads only     |
| Create leads    | ✅    | ✅                 |
| Edit leads      | ✅    | Own leads only     |
| Delete leads    | ✅    | ❌                 |
| Export CSV      | ✅    | ✅ (own leads)     |

---

## Submission

**Email:** ritik.yadav@servicehive.tech  
**Subject:** `MERN Internship Assignment Submission - Your Name`
