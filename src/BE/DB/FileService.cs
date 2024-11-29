﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Chats.BE.DB;

[Table("FileService")]
public partial class FileService
{
    [Key]
    public int Id { get; set; }

    public byte FileServiceTypeId { get; set; }

    [StringLength(100)]
    public string Name { get; set; } = null!;

    [StringLength(500)]
    public string Configs { get; set; } = null!;

    public bool IsDefault { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    [ForeignKey("FileServiceTypeId")]
    [InverseProperty("FileServices")]
    public virtual FileServiceType FileServiceType { get; set; } = null!;
}
