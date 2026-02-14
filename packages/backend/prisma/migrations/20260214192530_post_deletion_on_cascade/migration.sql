-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_id_fkey";

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
