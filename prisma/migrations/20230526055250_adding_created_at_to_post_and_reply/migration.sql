BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Post] ADD [createdAt] DATETIME2 CONSTRAINT [Post_createdAt_df] DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE [dbo].[Reply] ADD [createdAt] DATETIME2 CONSTRAINT [Reply_createdAt_df] DEFAULT CURRENT_TIMESTAMP;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
