using Microsoft.AspNetCore.Mvc;
using Tempestas.API.Controllers.IControllers;
using Tempestas.MainData.AiCommunicationModels;
using Tempestas.Services.Core.Interfaces;

namespace Tempestas.API.Controllers
{
    [Controller]
    [Route("api/predictions")]
    public class PredictionController : Controller, IPredictionController
    {
        private readonly IPredictionService _predictionService;
        public PredictionController(IPredictionService predictionService)
        {
            _predictionService = predictionService;
        }

        [HttpGet("{deviceId}")]
        public async Task<IActionResult> GetPredictionForDeviceAsync(string deviceId)
        {
            try
            {
                PredictionResponse? pr = await _predictionService.GetPredictionForDeviceAsync(deviceId);
                return pr != null ? Ok(pr) : NotFound(new { error = "Prediction not found" });
            }
            catch
            {
                return StatusCode(500, new { error = "An error occurred while retrieving the prediction" });
            }
        }
    }
}
