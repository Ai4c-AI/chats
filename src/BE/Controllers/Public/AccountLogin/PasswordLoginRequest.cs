﻿namespace Chats.BE.Controllers.Public.AccountLogin;

public record PasswordLoginRequest
{
    public required string UserName { get; init; }
    public required string Password { get; init; }
}
