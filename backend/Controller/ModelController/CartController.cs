using System;
using System.Security.Claims;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Ocsp;

public class CartController : Controller
{
    private ApplicationDbContext _context;
    public JwtService jwtService = new JwtService("your secret key");
    public CartController(ApplicationDbContext dbContext)
    {
        this._context = dbContext;
    }

    [HttpGet("/api/v1/cart")]
    public async Task<IActionResult> GetCart()
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await (from Cart in _context.cart join 
                Product in _context.product on Cart.product_id equals Product.product_id where 
                Cart.user_id == userId
                select new
                {
                    cart_id = Cart.cart_id,
                    product_id = Product.product_id,
                    product_name = Product.product_name,
                    product_price = Product.product_price,
                    product_image = Product.product_image,
                    product_rate = Product.product_rate,
                    product_size = Product.product_size,
                    product_brand = Product.product_brand,
                    product_before_price = Product.product_before_price,
                    product_sale = Product.product_sale
                }
            ).ToListAsync();
            return new JsonResult(new {status="success", data=result}){StatusCode=200};
        }
        else
        {
            return Unauthorized();
        }

    }

    [HttpGet("/api/v1/cart/{id}")]
    public async Task<IActionResult> AddProductToCart(int id)
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier)?.Value);
            Cart cartProduct = new Cart()
            {
                user_id = userId,
                product_id = id,
            };
            await _context.cart.AddAsync(cartProduct);
            await _context.SaveChangesAsync();
            return new JsonResult(new {status="success",message="product added to cart"}){StatusCode = 201};
        }
        else
        {
            return Unauthorized();
        }
    }

    [HttpDelete("/api/v1/cart/{id}")]
    public async Task<IActionResult> DeleteProductFromCart(int id)
    {
        var cartProduct = await _context.cart.Where(c => c.product_id == id).ToListAsync();
        if (cartProduct != null)
        {
            _context.cart.RemoveRange(cartProduct);
            await _context.SaveChangesAsync();
            return StatusCode(200);
        }
        else
        {
            return StatusCode(404);
        }
    }

    [HttpDelete("/api/v1/cart")]
        public async Task<IActionResult> DeleteProductsFromCart()
    {
        var cartProduct = await _context.cart.ToListAsync();
        if (cartProduct != null)
        {
            _context.cart.RemoveRange(cartProduct);
            await _context.SaveChangesAsync();
            return StatusCode(200);
        }
        else
        {
            return StatusCode(404);
        }
    }
}
