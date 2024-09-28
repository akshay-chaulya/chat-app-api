/*
  Warnings:

  - You are about to drop the column `isGroup` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `conversationIds` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "isGroup",
DROP COLUMN "logoUrl",
DROP COLUMN "name",
DROP COLUMN "verified";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "imageUrl",
DROP COLUMN "videoUrl";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "conversationIds";
