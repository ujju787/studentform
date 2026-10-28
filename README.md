# Student Portal: Registration, Login & Verified Dashboard

A full-stack web application built with **React**, **Node.js/Express**, and **MySQL**. Users register with their academic student details, log in with verified credentials, and view their live details fetched directly from the MySQL database on a protected student dashboard.

---

## 🌟 Features

- **Student Registration**: Register with Name, Email, Password, Roll Number, Course, Department, and Contact Phone.
- **Secure Authentication**: Passwords hashed using `bcryptjs` (salt rounds: 10), stateless session management via JSON Web Tokens (`jsonwebtoken`).
- **Protected Student Dashboard**: Real-time retrieval of student records from MySQL database on login; guarded by authentication middleware and frontend route guards.
- **Duplicate Prevention**: Rejects duplicate student emails and duplicate roll numbers with friendly error messaging.
- **Automatic Table Initialization**: The server automatically creates the `students` table if it does not already exist when connected to MySQL.
- **Production Ready**: Fully preconfigured for deployment on Render (Static Site + Web Service or Unified Service).

---

## 🏗️ Project Architecture & Structure

```text
simple signup and login form and dashboard/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar with user badge and logout
│   │   │   └── ProtectedRoute.jsx # Route guard for /dashboard
│   │   ├── pages/
│   │   │   ├── Register.jsx    # Registration form
│   │   │   ├── Login.jsx       # Login form
│   │   │   └── Dashboard.jsx   # Student details dashboard
│   │   ├── services/
│   │   │   └── api.js          # Fetch wrapper with JWT headers
│   │   ├── App.jsx             # Router configuration
│   │   ├── main.jsx
│   │   └── index.css           # Modern, responsive styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MySQL connection pool & auto-table creation
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register & Login logic
│   │   │   └── studentController.js  # Protected profile fetcher
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js     # JWT Bearer token validator
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth
│   │   │   └── studentRoutes.js      # /api/student
│   │   ├── schema.sql          # SQL schema definition
│   │   └── server.js           # Express app & static server
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── package.json                # Root scripts
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema (`students` table)

```sql
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  roll_number VARCHAR(50) NOT NULL UNIQUE,
  course VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🚀 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A running MySQL instance (MySQL Server, XAMPP, or a cloud MySQL database like Aiven or Clever Cloud)

### 1. Database Setup
Create a database named `student_db` in MySQL (or let the app connect to your existing MySQL database):
```sql
CREATE DATABASE student_db;
```

### 2. Configure Backend Environment
Navigate to `server/` and check `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```
*(If you are using a cloud MySQL database URL, you can alternatively set `DATABASE_URL=mysql://...` and `DB_SSL=true`)*

### 3. Start Backend Server
From the root directory or inside `server/`:
```bash
cd server
npm start
```
You should see:
```text
🚀 Server is running on port 5000
🔗 API Base: http://localhost:5000/api
 Connected to MySQL database successfully.
 Verified "students" table exists.
```

### 4. Start React Frontend
In a new terminal, navigate to `client/`:
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Registers student; returns JWT & profile |
| `POST` | `/api/auth/login` | No | Authenticates student; returns JWT & profile |
| `GET` | `/api/student/profile` | Yes (`Bearer <token>`) | Returns full student record from MySQL |
| `GET` | `/api/health` | No | Health check |

---

## ⚡ Steps to Deploy on Vercel

Vercel is ideal for lightning-fast deployments with automatic CI/CD and edge CDN. The project is pre-configured with `vercel.json` and `api/index.js` so you can deploy **both the React frontend and Node.js backend together in one single Vercel deployment**!

> **Note on MySQL**: Because Vercel is a serverless environment, MySQL must be hosted in the cloud. Free options include [Aiven for MySQL](https://aiven.io/) or [Clever Cloud](https://clever-cloud.com/).

### Method 1: Single Unified Project on Vercel (Recommended)

In this setup, your React app and API endpoints (`/api/*`) live on the same domain (e.g. `https://your-app.vercel.app`), eliminating any CORS issues.

#### Step 1: Create a Free Cloud MySQL Database
1. Go to [Aiven.io](https://aiven.io/) or [Clever Cloud](https://clever-cloud.com/) and create a free MySQL database.
2. Copy the connection credentials:
   - Host
   - Port
   - User
   - Password
   - Database Name

#### Step 2: Push Your Project to GitHub
```bash
git init
git add .
git commit -m "feat: setup vercel deployment"
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

#### Step 3: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Leave **Framework Preset** as **Other** (Vercel will detect `vercel.json`).
5. Open the **Environment Variables** section and add:
   - `DB_HOST`: `<Your Cloud MySQL Host>`
   - `DB_PORT`: `<Your Cloud MySQL Port>`
   - `DB_USER`: `<Your Cloud MySQL User>`
   - `DB_PASSWORD`: `<Your Cloud MySQL Password>`
   - `DB_NAME`: `<Your Cloud MySQL Database Name>`
   - `DB_SSL`: `true`
   - `JWT_SECRET`: `<A secure random secret key>`
6. Click **Deploy**.
7. Once finished, visit your live URL:
   - Frontend: `https://your-app.vercel.app`
   - Dashboard: `https://your-app.vercel.app/dashboard`
   - API Health: `https://your-app.vercel.app/api/health`

---

### Method 2: Deploy Frontend on Vercel + Backend on Render

If you prefer running the backend on a dedicated Node.js service (e.g. on Render):
1. Deploy the backend on Render as a **Web Service** (see instructions below).
2. On Vercel, click **Add New...** → **Project** and select your repository.
3. Set **Root Directory** to `client`.
4. Vercel automatically selects the **Vite** preset.
5. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-render-backend-url.onrender.com`
6. Click **Deploy**!

---

## ☁️ Steps to Deploy on Render

Render does not offer a free managed MySQL service directly (Render natively provides PostgreSQL), but you can connect Render to a free managed cloud MySQL database like **Aiven** or **Clever Cloud**.

### Step 1: Provision Free Cloud MySQL Database
1. Go to [Aiven.io](https://aiven.io/) or [Clever Cloud](https://www.clever-cloud.com/) and create a free account.
2. Create a free **MySQL** database service.
3. Once active, note the connection details:
   - **Host** (e.g., `mysql-xxxx.aivencloud.com`)
   - **Port** (e.g., `12345`)
   - **User** (e.g., `avnadmin`)
   - **Password**
   - **Database Name** (e.g., `defaultdb` or `student_db`)

### Step 2: Push Your Code to GitHub
1. In your project root, initialize Git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "feat: complete student auth and dashboard"
   ```
2. Create a repository on [GitHub](https://github.com/) and push your code:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy Backend on Render (Web Service)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Fill in the service configuration:
   - **Name**: `student-auth-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In the **Environment Variables** section, add:
   - `PORT`: `5000`
   - `DB_HOST`: `<Your Cloud MySQL Host>`
   - `DB_PORT`: `<Your Cloud MySQL Port>`
   - `DB_USER`: `<Your Cloud MySQL User>`
   - `DB_PASSWORD`: `<Your Cloud MySQL Password>`
   - `DB_NAME`: `<Your Cloud MySQL Database Name>`
   - `DB_SSL`: `true`
   - `JWT_SECRET`: `<Generate a random secret string>`
   - `CLIENT_URL`: `*` (or your frontend Render URL once created)
6. Click **Create Web Service**. Wait for the build to complete and copy your live backend URL (e.g., `https://student-auth-api.onrender.com`).

### Step 4: Deploy Frontend on Render (Static Site)
1. On the Render Dashboard, click **New +** -> **Static Site**.
2. Connect the same GitHub repository.
3. Fill in the static site configuration:
   - **Name**: `student-auth-portal`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. In the **Environment Variables** section, add:
   - `VITE_API_URL`: `https://student-auth-api.onrender.com` *(use your backend URL from Step 3)*
5. Configure client routing under the **Redirects/Rewrites** tab:
   - Click **Add Rule**:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: `Rewrite`
6. Click **Create Static Site**.
7. Once deployed, open your live URL to test registration, login, and the student dashboard!
