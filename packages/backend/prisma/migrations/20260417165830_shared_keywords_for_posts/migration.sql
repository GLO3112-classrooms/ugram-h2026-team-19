/*
  Warnings:

  - You are about to drop the column `post_id` on the `post_keyword` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `post_keyword` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "post_keyword" DROP CONSTRAINT "post_keyword_post_id_fkey";

-- AlterTable
ALTER TABLE "post_keyword" DROP COLUMN "post_id";

-- CreateTable
CREATE TABLE "_PostKeywords" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostKeywords_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PostKeywords_B_index" ON "_PostKeywords"("B");

-- CreateIndex
CREATE UNIQUE INDEX "post_keyword_value_key" ON "post_keyword"("value");

-- AddForeignKey
ALTER TABLE "_PostKeywords" ADD CONSTRAINT "_PostKeywords_A_fkey" FOREIGN KEY ("A") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostKeywords" ADD CONSTRAINT "_PostKeywords_B_fkey" FOREIGN KEY ("B") REFERENCES "post_keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;
