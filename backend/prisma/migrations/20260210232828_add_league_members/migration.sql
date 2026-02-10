-- CreateTable
CREATE TABLE "LeagueMember" (
    "leagueId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "cardPoolUrl" TEXT,

    CONSTRAINT "LeagueMember_pkey" PRIMARY KEY ("leagueId","userId")
);

-- AddForeignKey
ALTER TABLE "LeagueMember" ADD CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeagueMember" ADD CONSTRAINT "LeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
