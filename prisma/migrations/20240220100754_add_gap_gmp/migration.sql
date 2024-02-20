-- CreateTable
CREATE TABLE "GoodAgriculturalPractice" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "GoodAgriculturalPractice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodManufacturingPractice" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "GoodManufacturingPractice_pkey" PRIMARY KEY ("id")
);
