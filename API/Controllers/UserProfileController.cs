using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class UserProfileController : ControllerBase
{
    private readonly ILogger<UserProfileController> _logger;
    private readonly DataContext _context;

    public UserProfileController(ILogger<UserProfileController> logger, DataContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet(Name = "GetUserProfileController")]
    public async Task<ActionResult<List<UserProfileModel>>> Get()
    {
        return Ok(await _context.UserProfiles.ToListAsync());
    }
}