using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tempestas.MainData.AiCommunicationModels
{
    public class Record
    {
        [JsonProperty("temperature")]
        public double Temperature { get; set; }

        [JsonProperty("humidity")]
        public double Humidity { get; set; }

        [JsonProperty("air_quality")]
        public double AirQuality { get; set; }

        [JsonProperty("timestamp")]
        public DateTime Timestamp { get; set; }
    }
}
