using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tempestas.MainData.AiCommunicationModels
{
    public class DeviceData
    {
        [JsonProperty("device_id")]
        public string DeviceId { get; set; }

        [JsonProperty("records")]
        public List<Record> Records { get; set; }
    }
}
