﻿
using Chats.BE.Infrastructure.Functional;

namespace Chats.BE.Services.UrlEncryption;

public static class UrlEncryptionServiceExtensions
{
    public static string EncryptChatId(this IUrlEncryptionService that, int chatId)
    {
        return that.Encrypt(chatId, EncryptionPurpose.ChatId);
    }

    public static int DecryptChatId(this IUrlEncryptionService that, string encryptedChatId)
    {
        return that.DecryptAsInt32(encryptedChatId, EncryptionPurpose.ChatId);
    }

    public static string EncryptFileId(this IUrlEncryptionService that, int fileId)
    {
        return that.Encrypt(fileId, EncryptionPurpose.FileId);
    }

    public static int DecryptFileId(this IUrlEncryptionService that, string encryptedFileId)
    {
        return that.DecryptAsInt32(encryptedFileId, EncryptionPurpose.FileId);
    }

    public static string CreateFileIdPath(this IUrlEncryptionService that, TimedId timedId)
    {
        return that.CreateSignedPath(timedId, EncryptionPurpose.FileId);
    }

    public static Result<int> DecodeFileIdPath(this IUrlEncryptionService that, string path, long validBefore, string hash)
    {
        return that.DecodeSignedPathAsInt32(path, validBefore, hash, EncryptionPurpose.FileId);
    }

    public static string EncryptMessageId(this IUrlEncryptionService that, long messageId)
    {
        return that.Encrypt(messageId, EncryptionPurpose.MessageId);
    }

    public static long DecryptMessageId(this IUrlEncryptionService that, string encryptedMessageId)
    {
        return that.DecryptAsInt64(encryptedMessageId, EncryptionPurpose.MessageId);
    }

    public static long? DecryptMessageIdOrNull(this IUrlEncryptionService that, string? encryptedMessageId)
    {
        return encryptedMessageId == null ? null : that.DecryptAsInt64(encryptedMessageId, EncryptionPurpose.MessageId);
    }

    public static string EncryptChatGroupId(this IUrlEncryptionService that, int chatGroupId)
    {
        return that.Encrypt(chatGroupId, EncryptionPurpose.ChatGroupId);
    }

    public static string? EncryptChatGroupId(this IUrlEncryptionService that, int? chatGroupId)
    {
        return chatGroupId == null ? null : that.Encrypt(chatGroupId.Value, EncryptionPurpose.ChatGroupId);
    }

    public static int DecryptChatGroupId(this IUrlEncryptionService that, string encryptedChatId)
    {
        return that.DecryptAsInt32(encryptedChatId, EncryptionPurpose.ChatGroupId);
    }

    public static int? DecryptChatGroupIdOrNull(this IUrlEncryptionService that, string? encryptedChatId)
    {
        return encryptedChatId == null ? null : that.DecryptAsInt32(encryptedChatId, EncryptionPurpose.ChatGroupId);
    }

    public static string EncryptChatShareId(this IUrlEncryptionService that, int chatShareId)
    {
        return that.Encrypt(chatShareId, EncryptionPurpose.ChatShareId);
    }

    public static int DecryptChatShareId(this IUrlEncryptionService that, string encryptedChatShareId)
    {
        return that.DecryptAsInt32(encryptedChatShareId, EncryptionPurpose.ChatShareId);
    }
}