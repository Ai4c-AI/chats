﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Chats.BE.DB;

public partial class FileService
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("name")]
    [StringLength(1000)]
    public string Name { get; set; } = null!;

    [Column("enabled")]
    public bool Enabled { get; set; }

    [Column("type")]
    [StringLength(1000)]
    public string Type { get; set; } = null!;

    [Column("configs")]
    [StringLength(2048)]
    public string Configs { get; set; } = null!;

    [Column("createdAt")]
    public DateTime CreatedAt { get; set; }

    [Column("updatedAt")]
    public DateTime UpdatedAt { get; set; }

    [InverseProperty("FileService")]
    public virtual ICollection<ChatModel> ChatModels { get; set; } = new List<ChatModel>();
}
