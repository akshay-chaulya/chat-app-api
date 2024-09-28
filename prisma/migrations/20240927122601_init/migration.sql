-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "messageIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
