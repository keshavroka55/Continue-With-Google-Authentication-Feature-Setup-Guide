# 🔐 Auth System

Full-stack authentication system built with **Express.js, Prisma, PostgreSQL, React, Vite, and TailwindCSS**.

## Features

* Email/password registration and login
* Google OAuth
* JWT authentication with HTTP-only cookies
* Role-based access control
* Password reset via email
* Protected routes
* Automatic role-based redirects

## Tech Stack

**Backend**

* Node.js
* Express.js
* Prisma
* PostgreSQL
* JWT
* Passport.js

**Frontend**

* React
* Vite
* TailwindCSS

---

## Getting Started

### Prerequisites

Make sure you have installed:

| Tool       | Version            |
| ---------- | ------------------ |
| Node.js    | v18+               |
| npm        | v9+                |
| PostgreSQL | v14+               |
| Git        | Any recent version |

* [Node.js](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/download/)
* [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/keshavroka55/Continue-With-Google-Authentication-Feature-Setup-Guide.git
cd Continue-With-Google-Authentication-Feature-Setup-Guide
```

### 2. Install Dependencies

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create the backend environment file:

```bash
cp .env.example .env
```

Install client dependencies:

```bash
cd ../client
npm install
```

If the client has an `.env.example` file:

```bash
cp .env.example .env
```

Return to the project root:

```bash
cd ..
```

> **Important:** Never commit `.env` files. Use `.env.example` as the template for required environment variables.

---

## Database Setup

Create a PostgreSQL database for the project.

### Using PostgreSQL

```sql
CREATE USER auth_user WITH PASSWORD 'password123';

CREATE DATABASE auth_database OWNER auth_user;

GRANT ALL PRIVILEGES ON DATABASE auth_database TO auth_user;
```

Update your `backend/.env`:

```env
DATABASE_URL="postgresql://auth_user:password123@localhost:5432/auth_database"
```

### Database URL Format

```text
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

---

## Environment Variables

### Backend

Create the environment file:

```bash
cd backend
cp .env.example .env
```

Example:

```env
PORT=5000

DATABASE_URL="postgresql://auth_user:password123@localhost:5432/auth_database"

JWT_SECRET="your-secret-key"
JWT_EXPIRATION=30d

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
```

For production, generate a strong JWT secret:

```bash
openssl rand -base64 32
```

> Never use the example secret in production.

---

## Google OAuth Setup

To enable **Continue with Google**:

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Configure the OAuth consent screen.
4. Create an OAuth 2.0 Client ID.
5. Select **Web application**.
6. Add the following authorized JavaScript origin:

```text
http://localhost:3000
```

7. Add the following authorized redirect URI:

```text
http://localhost:5000/api/auth/google/callback
```

8. Copy the Client ID and Client Secret into `backend/.env`:

```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
```

> The callback URL must exactly match the URL configured in Google Cloud Console.

---

## Password Reset Email

Password reset requires an email service.

For Gmail:

1. Enable 2-Step Verification.
2. Create a Gmail App Password.
3. Add the credentials to `backend/.env`.

Example:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="Auth App <your-email@gmail.com>"
```

> Use a Gmail **App Password**, not your normal Gmail password.

---

## Run Database Migration

From the `backend` directory:

```bash
cd backend
npx prisma migrate dev --name init
```

This will create the required database tables and generate Prisma Client.

---

## Run the Application

### Backend

```bash
cd backend
npm run dev
```

### Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application should now be available at:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## Authentication Flow

### Email Authentication

```text
Register
   ↓
Password hashed with bcrypt
   ↓
Stored in PostgreSQL
   ↓
Login
   ↓
JWT generated
   ↓
JWT stored in HTTP-only cookie
```

### Google OAuth

```text
Continue with Google
        ↓
Google Login
        ↓
OAuth Callback
        ↓
Find/Create User
        ↓
Generate JWT
        ↓
Role-based Redirect
```

---

## Roles

| Role         | Redirect     |
| ------------ | ------------ |
| `food_lover` | `/home`      |
| `chef`       | `/dashboard` |
| `admin`      | `/dashboard` |

---

## API Endpoints

| Method | Endpoint                    | Auth  | Description            |
| ------ | --------------------------- | ----- | ---------------------- |
| POST   | `/api/auth/register`        | No    | Register user          |
| POST   | `/api/auth/login`           | No    | Login                  |
| GET    | `/api/auth/me`              | Yes   | Get current user       |
| POST   | `/api/auth/logout`          | Yes   | Logout                 |
| POST   | `/api/auth/register-admin`  | Admin | Create admin           |
| GET    | `/api/auth/google`          | No    | Start Google OAuth     |
| GET    | `/api/auth/google/callback` | No    | OAuth callback         |
| POST   | `/api/auth/update-role`     | Yes   | Update role            |
| POST   | `/api/auth/forgot-password` | No    | Request password reset |
| POST   | `/api/auth/reset-password`  | No    | Reset password         |
| GET    | `/api/health`               | No    | Health check           |

---

## Testing

### Register

```text
http://localhost:3000/register
```

### Login

```text
http://localhost:3000/login
```

### Google Login

Click **Continue with Google** on the login page.

### Password Reset

```text
http://localhost:3000/forgot-password
```

### API Health Check

```bash
curl http://localhost:5000/api/health
```

---

## Common Issues

### Database Connection Error

Check:

* PostgreSQL is running.
* `DATABASE_URL` is correct.
* PostgreSQL username and password are correct.

On Linux:

```bash
sudo systemctl status postgresql
```

### Module Not Found

Install dependencies:

```bash
npm install
```

Run this inside the required project directory.

### Google OAuth Not Working

Check that:

* The JavaScript origin is correct.
* The redirect URI is correct.
* `GOOGLE_CALLBACK_URL` matches the Google Cloud configuration exactly.

### Prisma Migration Failed

Check your database connection:

```bash
npx prisma migrate dev
```

> `npx prisma migrate reset` will delete existing database data. Use it only when you understand the consequences.

---

## Project Structure

```text
auth/
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── .env
│   ├── .env.example
│   └── ...
├── client/
│   └── ...
├── CONTRIBUTING.md
├── Improvement.md
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
```

---

## Contributing

Contributions are welcome!

Please read the **[CONTRIBUTING.md](CONTRIBUTING.md)** before submitting a Pull Request.

---

## License

This project is licensed under the **MIT License**.

See the **[LICENSE](LICENSE)** file for details.

---

## Author

**Keshav Roka**

GitHub: [@keshavroka55](https://github.com/keshavroka55)
