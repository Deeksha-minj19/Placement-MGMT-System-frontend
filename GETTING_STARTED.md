# Campus Placement Management System - Getting Started

This guide provides a clear overview of the project structure, tech stack, initialization steps, and deployment procedures for the **Campus Placement Management System**.

## 🚀 Project Overview

The Campus Placement Management System is a comprehensive platform designed to manage placement drives, student applications, and admin controls. It features a modern React-based frontend and a robust Express-based backend.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 7](https://vite.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router Dom 7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend (`server/`)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **FileUpload**: [Multer](https://github.com/expressjs/multer)
- **Mail Service**: [Nodemailer](https://nodemailer.com/)

---

## 📂 Project Structure

```text
placement/
├── client/              # React + Vite Frontend
│   ├── src/             # Frontend source code
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── utils/       # Helpers and API configuration
│   │   └── context/     # Global state management
│   ├── public/          # Static assets
│   └── tailwind.config.js
├── server/              # Express API Backend
│   ├── routes/          # API endpoints (Auth, Admin, Student)
│   ├── middleware/      # Auth and validation middleware
│   ├── uploads/         # Destination for uploaded files
│   ├── database.js      # SQLite connection and schema
│   └── index.js         # Entry point
├── views/               # Legacy EJS templates (for reference)
├── public/              # Legacy static files (for reference)
└── server.js            # Legacy entry point (for reference)
```

---

## ⚙️ Initialization Steps

### 1. Prerequisites
Ensure you have **Node.js** and **npm** installed.

### 2. Setting Up the Backend
```bash
cd server
npm install
# Create a .env file (see .env.example)
# To start the server:
node index.js
```

### 3. Setting Up the Frontend
```bash
cd client
npm install
# Create a .env file (see .env.example)
# To start the dev server:
npm run dev
```

---

## ☁️ Free Deployment Guide

### 1. Frontend (on [Vercel](https://vercel.com/))
1. The `client` folder is already pushed to GitHub: [Frontend Repo](https://github.com/Deeksha-minj19/Placement-MGMT-System-frontend.git).
2. Log in to Vercel and click **"Add New"** > **"Project"**.
3. Import the repository above.
4. Set **Root Directory** to `/`. (Vercel will detect it correctly as the repo only contains the frontend).
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://placement-mgmt-system-backend.onrender.com/api`
6. Click **Deploy**.

### 2. Backend (on [Render](https://render.com/))
1. The `server` folder is already pushed to GitHub: [Backend Repo](https://github.com/Deeksha-minj19/Placement-MGMT-System-backend.git).
2. Login to Render and click **"New"** > **"Web Service"**.
3. Connect the repository above.
4. Set **Root Directory** to `/`. (Render will detect it correctly as the repo only contains the backend).
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `node index.js`
7. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `JWT_SECRET`: A random secure string.
8. Click **Create Web Service**.

> [!WARNING]
> **SQLite Limitation**: Render's free tier uses an ephemeral filesystem. This means any data saved to `placement.db` will be **lost** whenever the server restarts or redeploys. For persistent data, consider switching to a free cloud database like [Neon (PostgreSQL)](https://neon.tech/) or [MongoDB Atlas](https://www.mongodb.com/atlas/database).

---

## 📚 Resources
- [Vite Documentation](https://vitejs.dev/guide/)
- [Express Reference](https://expressjs.com/en/4x/api.html)
- [Render Deployment Docs](https://docs.render.com/deploy-node-express-app)
- [Vercel React Guide](https://vercel.com/docs/frameworks/react)
