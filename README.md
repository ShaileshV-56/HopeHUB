# HopeHUB - Food Donation Platform

A full-stack application connecting food donors with organizations in need, built with React frontend and Node.js/Express backend.

## 🌟 Features

- **Food Donation Management** - Submit and track food donations
- **Organization Registration** - Organizations can register and request donations
- **Donor Management** - Donor profiles and donation history
- **Real-time Dashboard** - Statistics and analytics
- **RESTful API** - Complete backend API with PostgreSQL

## 🏗️ Project Structure

HopeHUB/
├── frontend/ # React Vite application
├── backend/ # Node.js Express API
├── database/ # PostgreSQL migrations and setup
├── api/ # API configuration and routes
└── README.md


## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your database in .env
docker-compose up -d
npm run migrate
npm run dev


### Frontend Setup

cd frontend
npm install
npm run dev

###📚 Tech Stack

Frontend:

React with TypeScript

Vite

Tailwind CSS

shadcn/ui components

Backend:

Node.js with Express

TypeScript

PostgreSQL with pg

Docker & Docker Compose

###🔧 API Endpoints
GET /api/health - Health check

POST /api/auth/login - User authentication

GET /api/donors - Donor management

POST /api/donations/food - Food donations

GET /api/organizations - Organization management

POST /api/donation-requests - Donation requests

GET /api/stats - Dashboard statistics


###🐳 Docker Deployment

# Start all services
docker-compose up -d

# Stop services
docker-compose down