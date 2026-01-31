using Microsoft.AspNetCore.Mvc;
using Tempestas.API.Controllers.IControllers;
using Tempestas.MainData.Models;
using Tempestas.Services.Core.Services;

namespace Tempestas.API.Controllers
{
    [ApiController]
    [Route("api/measurements")]  // "api/measurements" (explicit and plural)
    public class MeasurementController : ControllerBase, IMeasurementController
    {
        private readonly MeasurementService _measurementService;

        public MeasurementController(MeasurementService measurementService)
        {
            _measurementService = measurementService;
        }

        // POST: api/measurements
        [HttpPost]
        public async Task<IActionResult> AddMeasurementAsync([FromBody] Measurement? measurement)
        {
            try
            {
                if (measurement == null)
                {
                    return BadRequest(new { error = "Measurement cannot be null" });
                }

                bool result = await _measurementService.AddMeasurementAsync(measurement);

                if (result)
                {
                    return StatusCode(201);
                }
                else
                {
                    return StatusCode(500, new { error = "Failed to add measurement" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while adding the measurement" });
            }
        }

        // GET: api/measurements/{measurementId}
        [HttpGet("{measurementId}")]
        public async Task<IActionResult> GetLatestMeasurementAsync(string? measurementId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(measurementId))
                {
                    return BadRequest(new { error = "MeasurementId cannot be null or empty" });
                }

                if (!Guid.TryParse(measurementId, out Guid id))
                {
                    return BadRequest(new { error = "Invalid measurement ID format" });
                }

                var result = await _measurementService.GetLatestMeasurementAsync(id);

                return result != null ? Ok(result) : NotFound(new { error = "Measurement not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving the measurement" });
            }
        }
    }
}