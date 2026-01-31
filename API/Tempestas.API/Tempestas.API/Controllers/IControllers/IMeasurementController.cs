using Microsoft.AspNetCore.Mvc;
using Tempestas.MainData.Models;

namespace Tempestas.API.Controllers.IControllers
{
    public interface IMeasurementController
    {
        public Task<IActionResult> AddMeasurementAsync(MeasurementDTO? measurement);
        public Task<IActionResult> GetLatestMeasurementAsync();
    }
}
