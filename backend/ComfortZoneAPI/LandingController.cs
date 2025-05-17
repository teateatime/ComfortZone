using Microsoft.AspNetCore.Mvc;

namespace ComfortZone.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LandingController : ControllerBase
    {
        [HttpGet("highlight")]
        public IActionResult GetHighlight()
        {
            return Ok(new
            {
                message = "Unifying essential resources into one seamless search experience."
            });
        }
    }
}