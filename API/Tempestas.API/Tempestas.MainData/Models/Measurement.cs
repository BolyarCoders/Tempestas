using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

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
        [JsonIgnore]
        public Device Device { get; set; }

        [Column("temperature")]
        public double Temperature { get; set; }

        [Column("humidity")]
        public double Humidity { get; set; }

        [Column("air_quality")]
        public double AirQuality { get; set; }

        [Column("measured_at", TypeName = "timestamptz")]
        public DateTime MeasuredAt { get; set; }
    }
}
