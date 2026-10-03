# 🔐 Auth System

Full-stack authentication system built with **Express.js, Prisma, PostgreSQL, React, Vite, and TailwindCSS**.


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

Update your `backend/.env`:

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

---

## Roles

| Role         | Redirect     |
| ------------ | ------------ |
| `food_lover` | `/home`      |
| `chef`       | `/dashboard` |
| `admin`      | `/dashboard` |

Update: based on your requirements.

---

## Contributing

Contributions are welcome!

Please read the **[CONTRIBUTING.md](CONTRIBUTING.md)** before submitting a Pull Request.

---

## License

This project is licensed under the **MIT License**.

See the **[LICENSE](LICENSE)** file for details.
