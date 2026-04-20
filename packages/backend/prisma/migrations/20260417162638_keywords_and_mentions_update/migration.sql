/*
  Warnings:

  - You are about to drop the column `keywords` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `mentions` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "keywords",
DROP COLUMN "mentions";

-- CreateTable
CREATE TABLE "post_keyword" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "post_keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostMentions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostMentions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "post_keyword_value_idx" ON "post_keyword"("value");

-- CreateIndex
CREATE INDEX "_PostMentions_B_index" ON "_PostMentions"("B");

-- AddForeignKey
ALTER TABLE "post_keyword" ADD CONSTRAINT "post_keyword_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostMentions" ADD CONSTRAINT "_PostMentions_A_fkey" FOREIGN KEY ("A") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostMentions" ADD CONSTRAINT "_PostMentions_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
