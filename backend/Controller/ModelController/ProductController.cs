using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;


namespace ProductController;
public class ProductController : Controller
{
    private readonly ApplicationDbContext _context;
    private JwtService jwtService = new JwtService("your secret key");

    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("/api/v1/products/")]
    public async Task<IActionResult> getProducts([FromQuery]string q = null, [FromQuery]string key = null)
    {
        if (q != null && key != null)
        {
            var products = new List<Product>();
            if (key == "name")
            {
                products = await _context.product.Where(p => p.product_name.Contains(q)).ToListAsync();
            }
            if (key == "category")
            {
                products = await _context.product.Where(p => p.product_category == q).ToListAsync();
            }
            if (key == "brand")
            {
                products = await _context.product.Where(p => p.product_brand == q).ToListAsync();
            }
            if (key == "user")
            {
                products = await _context.product.Where(p => p.user_id == Convert.ToInt32(q)).ToListAsync();
            }
            return new JsonResult(new {status=true, data=products}){StatusCode=200};
        }
        else
        {
            var token = Request.Cookies["jwt"];
            if (token != null)
            {
                var userId = Convert.ToInt16(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
                var products = (from Product in _context.product
                    select new
                    {
                        Product.product_id, 
                        Product.user_id,
                        Product.product_image,
                        Product.product_name,
                        Product.product_brand,
                        Product.product_weight,
                        Product.product_battery_description,
                        Product.product_battery_included,
                        Product.product_camera,
                        Product.product_category,
                        Product.product_charging_time,
                        Product.product_color,
                        Product.product_compatible_devices,
                        Product.product_connectivity,
                        Product.product_cpu,
                        Product.product_delivery,
                        Product.product_description,
                        Product.product_display_technology,
                        Product.product_is_smart,
                        Product.product_number_of_usb,
                        Product.product_operating_system,
                        Product.product_price,
                        Product.product_ram,
                        Product.product_rate,
                        Product.product_resolution,
                        Product.product_screen_refresh_rate,
                        Product.product_storage,
                        Product.product_size,
                        Product.product_storage_type,
                        Product.product_sale,
                        Product.product_created_at,
                        Product.product_before_price,
                        favorite = _context.favorite.Any(f => f.product_id == Product.product_id && f.user_id == userId)
                    }
                );
                return new JsonResult(new {status=true, data=products}){StatusCode=200};
            }
            else
            {
                return Unauthorized();
            }
        }
    }

    [HttpGet("/api/v1/products/{productId}")]
    public async Task<IActionResult> getProducts(int productId)
    {
        var product = await _context.product.FirstOrDefaultAsync(p => p.product_id == productId);
        if (product != null)
        {
            return new JsonResult(new {status="success", data=product}){StatusCode=200};
        }
        else
        {
            return NotFound("Product Not Found");
        }
    }

    [HttpPost("/api/v1/products")]
    public async Task<IActionResult> createProduct()
    {
        var formData = await new FormReader(Request.Body).ReadFormAsync();
        Product product = new Product
        {
            product_name = formData["product_name"],
            user_id = Convert.ToInt32(formData["user_id"]),
            product_description = formData["product_description"],
            product_image = formData["product_image"],
            product_price = Convert.ToDecimal(formData["product_price"]),
            product_brand = formData["product_brand"],
            product_size = formData["product_size"],
            product_weight = formData["product_weight"],
            product_rate = 0,
            product_delivery = formData["product_delivery"],
            product_category = formData["product_category"],
            product_cpu = "unkown",
            product_number_of_usb = 0,
            product_storage_type = "unknown",
            product_battery_description = "unknown",
            product_camera = 0,
            product_operating_system = "unknown",
            product_storage = 0,
            product_ram = 0,
            product_resolution = "unknown",
            product_battery_included = "unknown",
            product_screen_refresh_rate = 0,
            product_screen_size = "unknown",
            product_display_technology = "unknown",
            product_is_smart = "unknown",
            product_color = "unknown",
            product_charging_time = 0,
            product_compatible_devices = "unknown",
            product_connectivity = "unknown",
            product_created_at = DateTime.Now,
            product_sale = Convert.ToBoolean(formData["product_sale"]),
            product_before_price = 0
        };
        if (formData["product_category"] == "computerTablets")
        {
            product.product_cpu = formData["product_cpu"];
            product.product_number_of_usb = Convert.ToInt32(formData["product_number_of_usb"]);
            product.product_storage_type = formData["product_storage_type"];
            product.product_storage = Convert.ToInt32(formData["product_storage"]);
            product.product_ram = Convert.ToInt32(formData["product_ram"]);
        }
        else if (formData["product_category"] == "MobileAccessories")
        {
            product.product_battery_description = formData["product_battery_description"];
            product.product_camera = Convert.ToInt32(formData["product_camera"]);
            product.product_operating_system = formData["product_operating_system"];
            product.product_storage = Convert.ToInt32(formData["product_storage"]);
            product.product_ram = Convert.ToInt32(formData["product_ram"]);
            product.product_resolution = formData["product_resolution"];
            product.product_battery_included = formData["product_battery_included"];
            product.product_screen_refresh_rate = Convert.ToInt32(formData["product_screen_refresh_rate"]);
        }
        else if (formData["product_category"] == "TVHomeTheater")
        {
            product.product_screen_size = formData["product_screen_size"];
            product.product_display_technology = formData["product_display_technology"];
            product.product_is_smart = formData["product_is_smart"];
            product.product_resolution = formData["product_resolution"];
        }
        else if (formData["product_category"] == "AudioHeadphone")
        {
            product.product_color = formData["product_color"];
            product.product_charging_time = Convert.ToInt32(formData["product_charging_time"]);
            product.product_compatible_devices = formData["product_compatible_devices"];
            product.product_connectivity = formData["product_connectivity"];
        }

        try
        {
            if (formData["product_sale"] == "true" || formData["product_sale"] == 1 || formData["product_sale"] == true)
            {
                product.product_before_price = Convert.ToInt32(formData["product_before_price"]);
            }
            await _context.product.AddAsync(product);
            await _context.SaveChangesAsync();
            return new JsonResult(new {status=true, data=product}){StatusCode=201};
        }
        catch (Exception err)
        {
            Console.WriteLine(err);
            return new JsonResult(new {status=false, message="error making product"}){StatusCode=400};
        }
    }

    [HttpPatch("/api/v1/products/{id}/rate/{rate}")]
    public async Task<IActionResult> EditProductRate(int id, int rate)
    {
        var product = await _context.product.FirstOrDefaultAsync(p => p.product_id == id);
        product.product_rate = rate;
        _context.product.Update(product);
        await _context.SaveChangesAsync();
        return StatusCode(200);
    }
}
