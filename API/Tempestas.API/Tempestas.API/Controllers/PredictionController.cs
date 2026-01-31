using Microsoft.AspNetCore.Mvc;
using Tempestas.API.Controllers.IControllers;

namespace Tempestas.API.Controllers
{
    public class PredictionController : Controller, IPredictionController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
