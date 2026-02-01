using System;
using System.Collections.Generic;
using System.Text;

namespace Tempestas.MainData.Models
{
    public class MeasurementDTO
    {
        public Guid Id { get; set; }
        public Guid DeviceId { get; set; }
        public double Temperature { get; set; }
        public double Humidity { get; set; }
        public double AirQuality { get; set; }
        public DateTimeOffset MeasuredAt { get; set; }
    }
}
