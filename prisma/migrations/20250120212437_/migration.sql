/*
  Warnings:

  - The primary key for the `AirstrikeFavoriteManager` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AirstrikeFavoriteManager` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AirstrikeFavoriteManager" DROP CONSTRAINT "AirstrikeFavoriteManager_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AirstrikeFavoriteManager_pkey" PRIMARY KEY ("userId", "postId");
