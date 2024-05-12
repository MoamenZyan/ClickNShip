

using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

public class OrderController : Controller
{
    private readonly ApplicationDbContext _context;
    public JwtService jwtService = new JwtService("your secret key");
    public OrderController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("/api/v1/order")]
    public async Task<IActionResult> CreateOrder()
    {
        var body = await new FormReader(Request.Body).ReadFormAsync();
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            Order order = new Order
            {
                user_id = userId,
                product_id = Convert.ToInt32(body["product_id"])
            };
            await _context.user_order.AddAsync(order);
            await _context.SaveChangesAsync();
            return Created();
        }
        return Unauthorized();
    }
    
    [HttpGet("/api/v1/order")]
    public async Task<IActionResult> GetOrders()
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            var orders = await (from order in _context.user_order join product in _context.product
                on order.product_id equals product.product_id where order.user_id == userId select product).ToListAsync();
            return new JsonResult(new {status="true", data=orders}){StatusCode=200};
        }
        return Unauthorized();
    }
}
