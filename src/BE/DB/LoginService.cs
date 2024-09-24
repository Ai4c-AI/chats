﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Chats.BE.DB;

public partial class LoginService
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(1000)]
    public string Type { get; set; } = null!;

    public bool Enabled { get; set; }

    [StringLength(2048)]
    public string Configs { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
