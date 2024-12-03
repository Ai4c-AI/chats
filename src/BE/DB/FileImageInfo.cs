﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Chats.BE.DB;

[Table("FileImageInfo")]
public partial class FileImageInfo
{
    [Key]
    public int FileId { get; set; }

    public int Width { get; set; }

    public int Height { get; set; }

    [ForeignKey("FileId")]
    [InverseProperty("FileImageInfo")]
    public virtual File File { get; set; } = null!;
}
