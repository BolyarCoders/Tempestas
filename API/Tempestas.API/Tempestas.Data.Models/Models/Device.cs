using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Metrics;
using System.Text;

namespace Tempestas.Data.Models.Models
{
    public class Device
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Required]
        [Column("location")]
        public string Location { get; set; } = null!;

        [Column("created_at", TypeName = "timestamptz")]
        [DefaultValue(typeof(DateTimeOffset), "")]
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
