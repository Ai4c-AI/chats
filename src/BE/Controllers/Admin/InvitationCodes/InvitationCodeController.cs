﻿using Chats.BE.Controllers.Admin.Common;
using Chats.BE.Controllers.Admin.InvitationCodes.Dtos;
using Chats.BE.Controllers.Common;
using Chats.BE.DB;
using Chats.BE.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Chats.BE.Controllers.Admin.InvitationCodes;

[Route("api/admin/invitation-code"), AuthorizeAdmin]
public class InvitationCodeController(ChatsDB db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<InvitationCodeDto[]>> GetInvitationCodes(CancellationToken cancellationToken)
    {
        InvitationCodeDto[] data = await db.InvitationCodes
            .Select(x => new InvitationCodeDto()
            {
                Id = x.Id,
                Value = x.Value,
                Count = x.Count,
                Username = db.Users
                    .Where(u => u.Id == x.CreateUserId)
                    .Select(x => x.Username)
                    .Single()
            })
            .ToArrayAsync(cancellationToken);
        return Ok(data);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateInvitationCode([FromBody] UpdateInvitationCodeRequest req, CancellationToken cancellationToken)
    {
        InvitationCode? code = await db.InvitationCodes.FindAsync([req.Id], cancellationToken);
        if (code == null)
        {
            return NotFound();
        }

        code.Count = req.Count;
        if (db.ChangeTracker.HasChanges())
        {
            await db.SaveChangesAsync(cancellationToken);
        }
        return NoContent();
    }

    [HttpDelete("{invitationCodeId}")]
    public async Task<ActionResult> DeleteInvitationCode(Guid invitationCodeId, CancellationToken cancellationToken)
    {
        InvitationCode? code = await db.InvitationCodes.FindAsync([invitationCodeId], cancellationToken);
        if (code == null)
        {
            return NotFound();
        }

        if (await db.UserInvitations.AnyAsync(x => x.InvitationCodeId == invitationCodeId, cancellationToken))
        {
            code.IsDeleted = true;
        }
        else
        {
            db.InvitationCodes.Remove(code);
        }

        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost]
    public async Task CreateInvitationCode([FromBody] CreateInvitationCodeRequest req, [FromServices] CurrentUser currentUser, CancellationToken cancellationToken)
    {
        db.InvitationCodes.Add(new InvitationCode()
        {
            Id = Guid.NewGuid(), 
            Value = req.Name,
            Count = req.Count,
            CreatedAt = DateTime.UtcNow,
            CreateUserId = currentUser.Id, 
            IsDeleted = false, 
        });
        await db.SaveChangesAsync(cancellationToken);
    }
}
