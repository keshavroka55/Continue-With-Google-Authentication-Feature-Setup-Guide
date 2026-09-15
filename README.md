# 🔐 Auth System — Full-Stack Authentication with Role-Based Access

A complete authentication system built with **Express.js + Prisma + PostgreSQL** (backend) and **React + Vite + TailwindCSS** (frontend).

### Features

- ✅ Email/Password Registration & Login
- ✅ Google OAuth ("Continue with Google")
- ✅ JWT Authentication (HTTP-only cookies)
- ✅ Role-Based Access Control (food_lover, chef, admin)
- ✅ Password Reset via Email
- ✅ Auto-redirect based on user role
- ✅ Protected routes

---

## 🚀 Setup Guide (Step by Step)

### Prerequisites

Make sure you have these installed on your machine:

| Tool | Version | How to Check | How to Install |
|------|---------|-------------|----------------|
| **Node.js** | v18+ | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | `npm --version` | Comes with Node.js |
| **PostgreSQL** | v14+ | `psql --version` | [postgresql.org/download](https://www.postgresql.org/download/) |
| **Git** | any | `git --version` | [git-scm.com](https://git-scm.com/) |

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/keshavroka55/Continue-With-Google-Authentication-Feature-Setup-Guide.git
cd Continue-With-Google-Authentication-Feature-Setup-Guide
```

---

### Step 2: Install All Dependencies

```bash
# Install root dependencies (concurrently — runs backend + client together)
npm install

# Install backend dependencies
cd backend
# Create environment file
cp .env.example .env
npm install

# Install client dependencies
cd ../client
cp .env.example .env
npm install

# Go back to root
cd ..
```

---

### Step 3: Set Up PostgreSQL Database

You need a PostgreSQL database. Here's how to create one:

#### Option A: Using the terminal (psql)

```bash
# Open PostgreSQL shell (you may need to use 'sudo -u postgres psql' on Linux)
psql -U postgres

# Inside the PostgreSQL shell, run:
CREATE USER auth_user WITH PASSWORD 'password123';
CREATE DATABASE auth_database OWNER auth_user;
GRANT ALL PRIVILEGES ON DATABASE auth_database TO auth_user;

# Exit
\q
```

#### Option B: Using pgAdmin (GUI)

1. Open pgAdmin
2. Right-click **Login/Group Roles** → Create → Login/Group Role
   - Name: `auth_user`
   - Under **Definition** tab: Password: `password123`
   - Under **Privileges** tab: Toggle "Can login?" to Yes
3. Right-click **Databases** → Create → Database
   - Name: `auth_database`
   - Owner: `auth_user`

> 💡 **Note**: You can change `auth_user`, `password123`, and `auth_database` to anything you want. Just make sure to update the `.env` file to match (see Step 4).

---

### Step 4: Configure the Backend `.env` File

Open `backend/.env` and update the values:

```env
PORT=5000
DATABASE_URL="postgresql://auth_user:password123@localhost:5432/auth_database"
JWT_SECRET="auth_jwt_secret_12345"
JWT_EXPIRATION=30d
```

#### Understanding the DATABASE_URL format:

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

| Part | What it is | Example |
|------|-----------|---------|
| `USERNAME` | PostgreSQL user you created | `auth_user` |
| `PASSWORD` | Password for that user | `password123` |
| `HOST` | Where your database runs | `localhost` |
| `PORT` | PostgreSQL port (default: 5432) | `5432` |
| `DATABASE_NAME` | Name of your database | `auth_database` |

#### Setting up the JWT_SECRET:

The `JWT_SECRET` is a random string used to sign tokens. For development, any string works. For production, generate a secure one:

```bash
# Run this in your terminal to generate a strong secret:
openssl rand -base64 32
```

Copy the output and paste it as the `JWT_SECRET` value.

---

### Step 5: Set Up Google OAuth (Continue with Google)

To enable "Continue with Google" login, you need to create a Google OAuth 2.0 project.

#### 5.1 — Go to Google Cloud Console

1. Open [console.cloud.google.com](https://console.cloud.google.com/)
2. Sign in with your Google account

#### 5.2 — Create a New Project

1. Click the project dropdown at the top → **New Project**
2. Enter a name (e.g., "Auth App") → **Create**
3. Select your new project from the dropdown

#### 5.3 — Enable the Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for **"Google+ API"** → Click it → **Enable**

#### 5.4 — Configure the OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** → **Create**
3. Fill in:
   - App name: `Auth App`
   - User support email: your email
   - Developer contact: your email
4. Click **Save and Continue** through the remaining steps

#### 5.5 — Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Auth App Web Client`
5. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   ```
6. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
7. Click **Create**
8. You'll see your **Client ID** and **Client Secret** — copy them!

#### 5.6 — Add to `.env`

Update these lines in `backend/.env`:

```env
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

> ⚠️ **Important**: The `GOOGLE_CALLBACK_URL` must exactly match what you entered in step 5.5 (Authorized redirect URIs).

---

### Step 6: Set Up Email for Password Reset (Optional)

To use the "Forgot Password" feature, you need an email service. The easiest way is using Gmail with an App Password.

#### 6.1 — Enable 2-Step Verification on Gmail

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Under "How you sign in to Google", enable **2-Step Verification**

#### 6.2 — Generate an App Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select app: **Mail**
3. Select device: **Other** → enter "Auth App"
4. Click **Generate**
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

#### 6.3 — Add to `.env`

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=Auth App <your_actual_email@gmail.com>
```

> 💡 The `EMAIL_PASSWORD` is the App Password you generated, NOT your Gmail login password.

---

### Step 7: Run Prisma Migration (Create Database Tables)

This creates the `users` table in your database based on the Prisma schema:

```bash
cd backend
npx prisma migrate dev --name init
```

What this does:
- Reads `prisma/schema.prisma`
- Creates the `users` table with all the columns defined in the User model
- Generates the Prisma Client so your code can talk to the database

You should see: `Your database is now in sync with your schema.`

> 💡 If you get a connection error, double-check your `DATABASE_URL` in `.env` and make sure PostgreSQL is running.

---

### Step 8: Run the Application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

#### Verify it's working:

| URL | What you should see |
|-----|-------------------|
| `http://localhost:3000` | Login page |
| `http://localhost:3000/register` | Registration page |
| `http://localhost:5000/api/health` | `{"status":"ok","timestamp":"..."}` |

---

## 🔧 How Each Part Works

### Authentication Flow

```
Register → Password hashed with bcrypt → Stored in PostgreSQL
Login    → Verify password → Generate JWT → Set HTTP-only cookie
Logout   → Clear cookie
```

### Google OAuth Flow

```
User clicks "Continue with Google"
  → Redirected to Google's login page
  → Google sends user info back to /api/auth/google/callback
  → Backend creates/finds user → Generates JWT cookie
  → If new user → Redirect to /select-role
  → If existing user → Redirect to /home or /dashboard (based on role)
```

### Role-Based Redirects

| Role | After Login Redirects To |
|------|------------------------|
| `food_lover` | `/home` |
| `chef` | `/dashboard` |
| `admin` | `/dashboard` |

### API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login with email/password |
| GET | `/api/auth/me` | ✅ | Get current user data |
| POST | `/api/auth/logout` | ✅ | Logout (clear cookie) |
| POST | `/api/auth/register-admin` | ✅ Admin only | Create admin user |
| GET | `/api/auth/google` | ❌ | Start Google OAuth |
| GET | `/api/auth/google/callback` | ❌ | Google OAuth callback |
| POST | `/api/auth/update-role` | ✅ | Update user role |
| POST | `/api/auth/forgot-password` | ❌ | Request password reset email |
| POST | `/api/auth/reset-password` | ❌ | Reset password with token |
| GET | `/api/health` | ❌ | Health check |

---

## 🐛 Common Issues & Fixes

### "Connection refused" or database errors

- Make sure PostgreSQL is running: `sudo systemctl status postgresql`
- Start it if needed: `sudo systemctl start postgresql`
- Verify your `DATABASE_URL` in `.env` matches your database credentials

### "Module not found" errors

- Make sure you ran `npm install` in all three directories (root, backend, client)

### Google OAuth not working

- Make sure you added both the JavaScript origin (`http://localhost:3000`) AND the redirect URI (`http://localhost:5000/api/auth/google/callback`) in Google Cloud Console
- Make sure `GOOGLE_CALLBACK_URL` in `.env` exactly matches the redirect URI

### Prisma migration fails

- Check your `DATABASE_URL` is correct
- Make sure the PostgreSQL user has permissions on the database
- Try: `npx prisma migrate reset` to start fresh (⚠️ this deletes all data)

### Email not sending

- Make sure you're using an **App Password**, not your regular Gmail password
- Make sure 2-Step Verification is enabled on your Google account
- Check the `EMAIL_FROM` format: `App Name <email@gmail.com>`

---


## 🧪 Testing the System

### 1. Register a new user
Go to `http://localhost:3000/register` → Fill in name, email, password → Pick a role → Submit

### 2. Login
Go to `http://localhost:3000/login` → Enter email and password → You should be redirected based on your role

### 3. Google Login
Click "Continue with Google" on the login page → Sign in with Google → If new user, you'll be asked to select a role

### 4. Password Reset
Go to `http://localhost:3000/forgot-password` → Enter your email → Check your inbox for the reset link

### 5. Test API directly
```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"food_lover"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"password123"}'

---


## 👨‍💻 Created By

**Keshav Roka** — [@keshavroka55](https://github.com/keshavroka55)


## Contributing

Contributions are welcome!

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file before submitting a Pull Request.
--- 