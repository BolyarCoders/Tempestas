using System;
using System.Collections.Generic;
using System.Text;
using Tempestas.MainData;
using Tempestas.MainData.Models;
using Tempestas.Services.Core.Interfaces;

namespace Tempestas.Services.Core.Services
{
    public class PredictionService : IPredictionService
    {
        private readonly TempestasDbContext _context;
        public PredictionService(TempestasDbContext context)
        {
            _context = context;
        }
        public async Task<string> GetPredictionForDeviceAsync(string deviceId)
        {
            try
            {
                return "Sunny with a chance of rain.";
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while getting the prediction for the device.", ex);
            }
        }
    }
}
