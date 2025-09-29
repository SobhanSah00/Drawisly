-- CreateEnum
CREATE TYPE "Shape" AS ENUM ('rectangle', 'diamond', 'circle', 'line', 'arrow', 'text', 'freeHand');

-- CreateTable
CREATE TABLE "Draw" (
    "id" TEXT NOT NULL,
    "shape" "Shape" NOT NULL,
    "strokeStyle" TEXT NOT NULL,
    "fillStyle" TEXT NOT NULL,
    "lineWidth" INTEGER NOT NULL,
    "font" TEXT,
    "fontSize" TEXT,
    "startX" INTEGER,
    "startY" INTEGER,
    "endX" INTEGER,
    "endY" INTEGER,
    "text" TEXT,
    "points" JSONB,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Draw" ADD CONSTRAINT "Draw_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
