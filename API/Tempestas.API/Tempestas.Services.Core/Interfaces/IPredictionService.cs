using System;
using System.Collections.Generic;
using System.Text;
using Tempestas.MainData.AiCommunicationModels;
using Tempestas.MainData.Models;

namespace Tempestas.Services.Core.Interfaces
{
    public interface IPredictionService
    {
        public Task<PredictionResponse?> GetPredictionForDeviceAsync(Guid deviceId);
    }
}
