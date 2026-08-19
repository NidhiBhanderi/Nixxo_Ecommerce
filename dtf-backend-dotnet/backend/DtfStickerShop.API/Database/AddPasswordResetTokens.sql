-- Run once against the DtfStickerShop database before using password reset.
-- The guards make this safe to run when the columns already exist.
IF COL_LENGTH('Users', 'PasswordResetTokenHash') IS NULL
    ALTER TABLE [Users] ADD [PasswordResetTokenHash] nvarchar(64) NULL;

IF COL_LENGTH('Users', 'PasswordResetTokenExpiresAt') IS NULL
    ALTER TABLE [Users] ADD [PasswordResetTokenExpiresAt] datetime2 NULL;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Users_PasswordResetTokenHash' AND object_id = OBJECT_ID('Users'))
    CREATE INDEX [IX_Users_PasswordResetTokenHash] ON [Users] ([PasswordResetTokenHash]);
