using Microsoft.AspNetCore.Mvc;

namespace Tempestas.API.Controllers
{
    public class DeviceController : Controller, IControllers.IDeviceController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
