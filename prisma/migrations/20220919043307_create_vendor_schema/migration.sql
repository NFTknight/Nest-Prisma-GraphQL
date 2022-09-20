-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "storeStatus" BOOLEAN NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "beneficiary" TEXT NOT NULL,
    "addressUrl" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isCheck" BOOLEAN NOT NULL DEFAULT false,
    "shortName" BOOLEAN NOT NULL,
    "description_ar" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "demo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_url_key" ON "Vendor"("url");
