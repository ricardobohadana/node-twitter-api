/*
  Warnings:

  - Made the column `createdAt` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Reply` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Post] ALTER COLUMN [createdAt] DATETIME2 NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Reply] ALTER COLUMN [createdAt] DATETIME2 NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
