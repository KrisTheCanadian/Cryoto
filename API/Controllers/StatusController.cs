using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("[controller]/[action]")]
public class StatusController : ControllerBase
{
    [HttpGet]
    public ActionResult<string> Check()
    {
        return Ok("Online!");
    }
}