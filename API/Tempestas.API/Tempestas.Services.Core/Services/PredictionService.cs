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
        public PredictionService(TempestasDbContext context)
        {
            _httpClient = new HttpClient();
            _context = context;
        }

        public PredictionService(TempestasDbContext context, HttpClient httpClient)
        {
            _httpClient = httpClient;
            _context = context;
        }
        public async Task<PredictionResponse?> GetPredictionForDeviceAsync(string deviceId)
        {
            try
            {
                List<Record> deviceRecords = await _context.Measurements
                    .Where(m => m.DeviceId.ToString() == deviceId)
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


                DeviceData request = new DeviceData
                {
                    DeviceId = deviceId,
                    Records = deviceRecords
                };
                string jsonContent = JsonConvert.SerializeObject(request);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_baseUrl}/predict", content);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<PredictionResponse>(responseBody);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while getting the prediction for the device.", ex);
            }
        }
    }
}
