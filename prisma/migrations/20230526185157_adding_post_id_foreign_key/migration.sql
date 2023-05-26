/*
  Warnings:

  - Added the required column `postId` to the `Reply` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Reply] DROP CONSTRAINT [Reply_authorId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Reply] ADD [postId] NVARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Reply] ADD CONSTRAINT [Reply_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[Post]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Reply] ADD CONSTRAINT [Reply_authorId_fkey] FOREIGN KEY ([authorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
