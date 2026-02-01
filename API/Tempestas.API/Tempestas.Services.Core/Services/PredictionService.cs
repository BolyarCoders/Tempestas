using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using Tempestas.MainData;
using Tempestas.MainData.Models;
using Tempestas.MainData.AiCommunicationModels;
using Tempestas.Services.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Tempestas.Services.Core.Services
{
    public class PredictionService : IPredictionService
    {
        private readonly TempestasDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl = "https://tempestas-ai.onrender.com";

        public PredictionService(TempestasDbContext context, HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<PredictionResponse?> GetPredictionForDeviceAsync(Guid deviceId)
        {
            List<Record> deviceRecords = await _context.Measurements
                .Where(m => m.DeviceId == deviceId)
                .OrderByDescending(m => m.MeasuredAt)
                .Take(50)
                .Select(m => new Record
                {
                    Temperature = m.Temperature,
                    Humidity = m.Humidity,
                    AirQuality = m.AirQuality,
                    Timestamp = m.MeasuredAt
                })
                .ToListAsync();

            if (deviceRecords.Count == 0)
            {
                return null;
            }

            DeviceData request = new DeviceData
            {
                DeviceId = deviceId.ToString(),
                Records = deviceRecords
            };

            string jsonContent = JsonConvert.SerializeObject(request);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_baseUrl}/predict", content);
            response.EnsureSuccessStatusCode();

            string responseBody = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<PredictionResponse>(responseBody);
        }
    }
}