using Microsoft.AspNetCore.Mvc;
using Tempestas.API.Controllers.IControllers;
using Tempestas.MainData.Models;
using Tempestas.Services.Core.Interfaces;

namespace Tempestas.API.Controllers
{
    [ApiController]
    [Route("api/measurements")]  // "api/measurements" (explicit and plural)
    public class MeasurementController : ControllerBase, IMeasurementController
    {
        private readonly IMeasurementService _measurementService;
        private readonly IDeviceService _deviceService;

        public MeasurementController(IMeasurementService measurementService, IDeviceService deviceService)
        {
            _measurementService = measurementService;
            _deviceService = deviceService;
        }

        [HttpPost]
        public async Task<IActionResult> AddMeasurementAsync([FromBody] MeasurementDTO? measurement)
        {
            try
            {
                if (measurement == null)
                {
                    return BadRequest(new { error = "Measurement cannot be null" });
                }
                Device? device = await _deviceService.GetDeviceInfoAsync(measurement.DeviceId.ToString());
                if (device == null)
                {
                    return BadRequest(new { error = "The device id references unknown device" });
                }
                Measurement measurement1 = new Measurement
                {
                    Id = measurement.Id,
                    DeviceId = measurement.DeviceId,
                    Temperature = measurement.Temperature,
                    Humidity = measurement.Humidity,
                    AirQuality = measurement.AirQuality,
                    MeasuredAt = measurement.MeasuredAt.DateTime,
                    Device = device
                };

                bool result = await _measurementService.AddMeasurementAsync(measurement1);

                if (result)
                {
                    return StatusCode(201);
                }
                else
                {
                    return StatusCode(500, new { error = "Failed to add measurement" });
                }
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while adding the measurement" });
            }
        }

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

                var result = await _measurementService.GetLatestMeasurementAsync(id.ToString());

                return result != null ? Ok(result) : NotFound(new { error = "Measurement not found" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving the measurement" });
            }
        }
    }
}