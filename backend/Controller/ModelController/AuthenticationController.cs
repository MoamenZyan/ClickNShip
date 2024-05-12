using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using BCrypt;
using Mail;
using Microsoft.EntityFrameworkCore;

// User Authentication Controller
public class UserAuthentication : Controller
{
    private readonly ApplicationDbContext _context;
    public JwtService jwt = new JwtService("your secret key");
    public UserAuthentication(ApplicationDbContext context)
    {
        _context = context;
    }

    // User Login Controller
    [HttpPost("/api/v1/users/authenticate")]
    public async Task<IActionResult> Login()
    {
        var data = await new FormReader(Request.Body).ReadFormAsync();
        if (data.ContainsKey("user_name") && data.ContainsKey("user_password"))
        {
            var user = _context.user.FirstOrDefault(u => string.Equals(u.user_name, data["user_name"], StringComparison.Ordinal));
            if (user != null)
            {
                var result = BCrypt.Net.BCrypt.Verify(data["user_password"], user.user_password);
                if (result == true)
                {
                    var token = jwt.GenerateToken(Convert.ToString(user.user_id));
                    Response.Headers["token"] = token;
                    Response.Cookies.Append("jwt", token
                    , new CookieOptions
                    {
                        Path="/",
                        Expires = DateTime.Now.AddDays(30),
                        HttpOnly = false,
                    });
                    return Ok(new {status = "success", message = "user authenticated"});
                }
                else
                {
                    return new JsonResult(new {status="fail",message="Unauthenticated User"}){StatusCode = 401};
                }
            }
        }
        return new JsonResult(new{status = "fail",message = "incorrect data"}){StatusCode = 400};
    }

    // Email Confirmation Controller
    [HttpPost("/api/v1/users/email-secret")]
    public async Task<IActionResult> EmailConfirmation()
    {
        var data = await new FormReader(Request.Body).ReadFormAsync();
        if (data.ContainsKey("user_email"))
        {
            int secret_code = OTP.RandomIntNumbers();
            await MailService.sendMail(data["user_email"], secret_code);
            EmailVerify emailVerify = new EmailVerify()
            {
                user_email = data["user_email"],
                secret_code = secret_code,
            };
            var email = await _context.email_verify.FirstOrDefaultAsync(email => email.user_email == data["user_email"]);
            if (email != null)
            {
                email.secret_code = secret_code;
            }
            else
            {
                await _context.email_verify.AddAsync(emailVerify);
            }
            await _context.SaveChangesAsync();
            return new JsonResult(new {status = "success", message = "secret code sent to your email"}){StatusCode = 200};
        }
        else
        {
            return new JsonResult(new {status = "fail", message = "email isn't correct",}){StatusCode = 400};
        }
    }

    [HttpPost("/api/v1/users/reset-url")]
    public async Task<IActionResult> SendResetUrl()
    {
        var data = await new FormReader(Request.Body).ReadFormAsync();
        if (data.ContainsKey("user_email"))
        {
            Guid guid = Guid.NewGuid();
            var user = await _context.user.FirstOrDefaultAsync(u => u.user_email == data["user_email"]);
            await MailService.sendUrl(data["user_email"], guid.ToString(), user.user_id);
            ResetPassword resetPassword = new ResetPassword()
            {
                user_email = data["user_email"],
                url_id = guid.ToString(),
                user_id = user.user_id
            };
            var email = await _context.reset_password.FirstOrDefaultAsync(email => email.user_email == data["user_email"]);
            if (email != null)
            {
                email.url_id = guid.ToString();
            }
            else
            {
                await _context.reset_password.AddAsync(resetPassword);
            }
            await _context.SaveChangesAsync();
            return new JsonResult(new {status = "success", message = "url sent to your email"}){StatusCode = 200};
        }
        else
        {
            return new JsonResult(new {status = "fail", message = "email isn't correct",}){StatusCode = 400};
        }
    }

    // Email Activion Controller
    [HttpPost("/api/v1/users/email-activion")]
    public async Task<IActionResult> EmailVerify()
    {
        var data = await new FormReader(Request.Body).ReadFormAsync();
        if (data.ContainsKey("secret") && data.ContainsKey("user_email"))
        {
            EmailVerify row = await _context.email_verify.FirstOrDefaultAsync(u => u.user_email == data["user_email"]);
            if (row != null && row.secret_code == Convert.ToInt32(data["secret"]))
            {
                _context.email_verify.Remove(row);
                await _context.SaveChangesAsync();
                return new JsonResult(new {status = "success", message = "email activated"}){StatusCode = 200};
            }
            return new JsonResult(new {status = "success", message = "secret code isn't correct"}){StatusCode = 401};
        }
        else
        {
            return new JsonResult(new {status = "fail", message = "incorrect data",});
        }
    }

    [HttpGet("/api/v1/users/check-reset/{user_id}/{id}")]
    public async Task<IActionResult> ResetPassword(int user_id, string id)
    {
        var reset = await _context.reset_password.FirstOrDefaultAsync(u => u.user_id == user_id);
        if (reset != null) {
            if (reset.url_id != id) {
                return Unauthorized();
            } else {
                return Ok();
            }
        }
        return Unauthorized();
    }


    [HttpPost("/api/v1/users/reset-password")]
    public async Task<IActionResult> ResetPassword()
    {
        var body = await new FormReader(Request.Body).ReadFormAsync();
        var user = await _context.user.FirstOrDefaultAsync(u => u.user_id == Convert.ToInt32(body["user_id"]));
        var new_password = body["user_password"];
        if (BCrypt.Net.BCrypt.Verify(new_password, user.user_password)) {
            return StatusCode(409);
        } else {
            user.user_password = BCrypt.Net.BCrypt.HashPassword(new_password, 10);
            var reset_password = await _context.reset_password.FirstOrDefaultAsync(r => r.user_id == Convert.ToInt32(body["user_id"]));
            _context.reset_password.Remove(reset_password);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }


    [HttpGet("/api/v1/users/logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Append("jwt", "", new CookieOptions
        {
            Path = "/",
            Expires = DateTime.Now.AddDays(-1),
            HttpOnly = false,
        });
        return Ok(new { status = "success", message = "user logged out" });
    }
}
