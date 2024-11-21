﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Chats.BE.DB;

[Table("UserInitialConfig")]
public partial class UserInitialConfig
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [StringLength(50)]
    public string? LoginType { get; set; }

    [Column(TypeName = "decimal(32, 16)")]
    public decimal Price { get; set; }

    [StringLength(4000)]
    public string Models { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public int? InvitationCodeId { get; set; }
}
