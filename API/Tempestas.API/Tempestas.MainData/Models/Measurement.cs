using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Tempestas.MainData.Models
{
    public class Measurement
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Required]
        [Column("device_id")]
        public Guid DeviceId { get; set; }

        [ForeignKey(nameof(DeviceId))]
        public Device Device { get; set; } = null!;

        [Column("temperature")]
        public double Temperature { get; set; }

        [Column("humidity")]
        public double Humidity { get; set; }

        [Column("air_quality")]
        public double AirQuality { get; set; }

        [Column("measured_at", TypeName = "timestamptz")]
        public DateTimeOffset MeasuredAt { get; set; }
    }
}
