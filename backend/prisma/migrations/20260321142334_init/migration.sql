-- CreateEnum
CREATE TYPE "Role" AS ENUM ('food_lover', 'chef', 'admin');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'food_lover',
    "bio" TEXT,
    "avatar" TEXT,
    "google_id" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_token" TEXT,
    "password_reset_token" TEXT,
    "password_reset_expiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");
