-- CreateEnum
CREATE TYPE "Role" AS ENUM ('food_lover', 'chef', 'admin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'food_lover';
