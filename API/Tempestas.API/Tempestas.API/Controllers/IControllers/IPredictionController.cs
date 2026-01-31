using Microsoft.AspNetCore.Mvc;

namespace Tempestas.API.Controllers.IControllers
{
    public interface IPredictionController
    {
        public Task<IActionResult> GetPredictionForDeviceAsync(string deviceId);
    }
}
