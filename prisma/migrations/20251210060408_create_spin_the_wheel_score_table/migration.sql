-- CreateTable
CREATE TABLE "SpinTheWheelScore" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpinTheWheelScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpinTheWheelScore_topic_score_timeSpent_idx" ON "SpinTheWheelScore"("topic", "score", "timeSpent");
