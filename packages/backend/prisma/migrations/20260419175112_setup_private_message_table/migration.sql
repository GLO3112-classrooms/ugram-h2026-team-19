-- CreateTable
CREATE TABLE "private_message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,

    CONSTRAINT "private_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "private_message_from_user_id_idx" ON "private_message"("from_user_id");

-- CreateIndex
CREATE INDEX "private_message_to_user_id_idx" ON "private_message"("to_user_id");

-- AddForeignKey
ALTER TABLE "private_message" ADD CONSTRAINT "private_message_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_message" ADD CONSTRAINT "private_message_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
