using Microsoft.AspNetCore.Mvc;
using Tempestas.MainData.Models;
using Tempestas.Services.Core.Services;

namespace Tempestas.API.Controllers
{
    [Route("api/[controller]")]
    public class DeviceController : Controller, IControllers.IDeviceController
    {
        private readonly DeviceService _deviceService;  
        public DeviceController(DeviceService deviceService)
        {
            _deviceService = deviceService;
        }
       
        
        [HttpPost]
        public async Task<IActionResult> AddDeviceAsync([FromBody] Device? device)
        {
            if (device == null)
            {
                return BadRequest(new { error = "Invalid device data" });
            }

            var success = await _deviceService.AddDeviceAsync(device);

            if (!success)
            {
                return StatusCode(500, new { error = "Failed to add device" });
            }

            return StatusCode(201);
        }



        [HttpGet("{deviceId}")]
        public async Task<IActionResult> GetDeviceAsync(string? deviceId)
        {
            try
            {
                if (string.IsNullOrEmpty(deviceId))
                {
                    return BadRequest(new { error = "DeviceId cannot be null or empty" });
                }

                var device = await _deviceService.GetDeviceInfoAsync(deviceId);
                return device != null ? Ok(device) : NotFound(new { error = "Device not found" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "An error occurred while retrieving the device" });
            }
        }

    }
}
