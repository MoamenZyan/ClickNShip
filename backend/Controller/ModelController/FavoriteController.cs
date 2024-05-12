using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Stripe;

public class FavoriteController : Controller
{
    private readonly ApplicationDbContext _context;
    private JwtService jwtService = new JwtService("your secret key");


    public FavoriteController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("/api/v1/favorite")]
    public async Task<IActionResult> GetFavoriteProducts()
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt16(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userId != null)
            {
                var result = await (from Favorite in _context.favorite join 
                    Product in _context.product on Favorite.product_id equals Product.product_id 
                    where Favorite.user_id == userId select Product).ToListAsync();
                return new JsonResult(new {status = "true", data=result});
            }
            else
            {
                return Unauthorized();
            }
        }
        else
        {
            return Unauthorized();
        }
    }
    [HttpPost("/api/v1/favorite/{id}")]
    public async Task<IActionResult> AddProductsToFavorites(int id)
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt16(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userId != null)
            {
                Favorite favorite = new Favorite()
                {
                    user_id = userId,
                    product_id = id
                };
                await _context.favorite.AddAsync(favorite);
                await _context.SaveChangesAsync();
                return new JsonResult(new {status="true", message="added product to favorites"});
            }
            else
            {
                return Unauthorized();
            }
        }
        else
        {
            return Unauthorized();
        }
    }

    [HttpDelete("/api/v1/favorite/{id}")]
    public async Task<IActionResult> RemoveProductsFromFavorites(int id)
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt16(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userId != null)
            {
                var favorite = await _context.favorite.FirstOrDefaultAsync(f => f.product_id == id && f.user_id == userId);
                _context.favorite.Remove(favorite);
                await _context.SaveChangesAsync();
                return new JsonResult(new {status="true", message="removed product from favorites"});
            }
            else
            {
                return Unauthorized();
            }
        }
        else
        {
            return Unauthorized();
        }
    }
}
