using Microsoft.AspNetCore.Mvc;
using Tempestas.MainData.Models;

namespace Tempestas.API.Controllers.IControllers
{
    public interface IDeviceController
    {
        public Task<IActionResult> GetDeviceAsync(string? deviceId);
        public Task<IActionResult> AddDeviceAsync(Device? device);
    }
}
