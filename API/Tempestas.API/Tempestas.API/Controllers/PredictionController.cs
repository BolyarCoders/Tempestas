using Microsoft.AspNetCore.Mvc;

namespace Tempestas.API.Controllers
{
    public class PredictionController : Controller, IControllers.IPredictionController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
