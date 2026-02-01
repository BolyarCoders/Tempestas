using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Tempestas.API.Controllers.IControllers;
using Tempestas.MainData.AiCommunicationModels;
using Tempestas.Services.Core.Interfaces;

namespace Tempestas.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowAll")]
    public class PredictionController : Controller, IPredictionController
    {
        private readonly IPredictionService _predictionService;
        private readonly ILogger<PredictionController> _logger;

        public PredictionController(
            IPredictionService predictionService,
            ILogger<PredictionController> logger)
        {
            _predictionService = predictionService;
            _logger = logger;
        }

        [HttpGet("{deviceId}")]
        public async Task<IActionResult> GetPredictionForDeviceAsync(string deviceId)
        {
            if (string.IsNullOrWhiteSpace(deviceId))
            {
                return BadRequest(new { error = "DeviceId cannot be empty" });
            }

            if (!Guid.TryParse(deviceId, out Guid deviceGuid))
            {
                return BadRequest(new { error = "Invalid DeviceId format" });
            }

            try
            {
                PredictionResponse? pr = await _predictionService.GetPredictionForDeviceAsync(deviceGuid);
                return pr != null
                    ? Ok(pr)
                    : NotFound(new { error = "Prediction not found" });
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "External service error for device {DeviceId}", deviceId);
                return StatusCode(503, new { error = "External prediction service is unavailable" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving prediction for device {DeviceId}", deviceId);
                return StatusCode(500, new { error = "An error occurred while retrieving the prediction" });
            }
        }
    }
}
