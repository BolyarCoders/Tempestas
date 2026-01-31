using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tempestas.MainData.AiCommunicationModels
{
    public class PredictionResponse
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("device_id")]
        public string DeviceId { get; set; }

        [JsonProperty("temperature")]
        public double Temperature { get; set; }

        [JsonProperty("humidity")]
        public double Humidity { get; set; }

        [JsonProperty("air_quality")]
        public double AirQuality { get; set; }

        [JsonProperty("predicted_for")]
        public DateTime PredictedFor { get; set; }

        [JsonProperty("generated_at")]
        public DateTime GeneratedAt { get; set; }

        [JsonProperty("confidence")]
        public double Confidence { get; set; }
    }
}
