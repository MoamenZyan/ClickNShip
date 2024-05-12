// User Controllers
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using BCrypt.Net;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace UserController;
public class UserController : Controller
{
    private readonly ApplicationDbContext _context;
    private JwtService jwtService = new JwtService("your secret key");
    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpGet("/api/v1/allusers")]
    public async Task<List<User>> GetUsers()
    {
        List<User> users = await _context.user.ToListAsync();
        return users;
    }

    [HttpGet("/api/v1/users")]
    public async Task<IActionResult> getUser([FromQuery]int id = -1)
    {
        if (id != -1)
        {
            var userInfo = await (from User in _context.user where User.user_id == id
                select new
                {
                    User.user_id,
                    User.user_address,
                    User.user_email,
                    User.user_phone,
                    User.user_photo,
                    User.user_name
                }).FirstOrDefaultAsync();
            return new JsonResult(new {status=true, data = new {user = userInfo}});
        }
        var token = HttpContext.Request.Cookies["jwt"];
        if (token != null)
        {
            var userIdClaim = jwtService.verifyToken(token);
            var userId = Convert.ToInt32(userIdClaim.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user_info = await (from User in _context.user where User.user_id == userId
                select new
                {
                    User.user_id,
                    User.user_address,
                    User.user_email,
                    User.user_phone,
                    User.user_photo,
                    User.user_name
                }).FirstOrDefaultAsync();
            return new JsonResult(new {status=true, data = new {user=new {user_info}}});
        }
        else
        {
            return Unauthorized("There is no token");
        }
    }

    [HttpPost("/api/v1/users")]
    public async Task<IActionResult> CreateUser()
    {
        var context = HttpContext;
        var FormReader = new FormReader(context.Request.Body);
        var data = await FormReader.ReadFormAsync();
        User user = new User()
        {
            user_photo = data["user_photo"],
            user_name = data["user_name"],
            user_password = BCrypt.Net.BCrypt.HashPassword(data["user_password"], 10),
            user_email = data["user_email"],
            user_phone = data["user_phone"],
            user_address = data["user_address"]
        };
        await _context.user.AddAsync(user);
        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpGet("/api/v1/user-check")]
    public async Task<IActionResult> checkUser()
    {
        User user = new User();
        var data = Request.Query;
        var properties = user.GetType().GetProperties();
        foreach (var property in properties)
        {
            if (property.Name == data["key"])
            {
                user = await _context.user.FirstOrDefaultAsync(u => EF.Property<object>(u, property.Name) == data["value"]);
                if (user == null)
                {
                    return Ok();
                }
                else
                {
                    return StatusCode(409);
                }
            }
        }
        return StatusCode(404);
    }

    [HttpPut("/api/v1/users")]
    public async Task<IActionResult> ChangeUserInfo()
    {
        var token = Request.Cookies["jwt"];
        var body = await new FormReader(Request.Body).ReadFormAsync();
        if (token != null)
        {
            var userId = Convert.ToInt16(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _context.user.FirstOrDefaultAsync(u => u.user_id == userId);
            user.user_address = body["user_address"];
            user.user_email = body["user_email"];
            user.user_phone = body["user_phone"];
            user.user_name = body["user_name"];
            _context.user.Update(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
        return Unauthorized();
    }
}
