using System;
using System.Collections.Generic;
using System.Text;
using Tempestas.MainData.Models;

namespace Tempestas.Services.Core.Interfaces
{
    public interface IMeasurementService
    {
        public Task<Measurement?> GetLatestMeasurementAsync(string id);
        public Task<bool> AddMeasurementAsync(Measurement? measurement);
    }
}
