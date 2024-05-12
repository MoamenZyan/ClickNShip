
using Microsoft.EntityFrameworkCore;
using Stripe;

var builder = WebApplication.CreateBuilder(args);
// Adding Db Context Service
builder.Services.AddDbContext<ApplicationDbContext>(options => {options.UseMySQL("your connection string");});
// Adding Controllers Service
builder.Services.AddControllers();

builder.Services.AddScoped<StripeClient>();
builder.Services.AddScoped<PaymentIntentService>();


builder.Services.AddCors(options => {
    options.AddPolicy("AllowMyLocal",
    builder => 
    {
        builder.WithOrigins("your origins").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

StripeConfiguration.ApiKey = "api key from stripe";


var app = builder.Build();


app.UseCors("AllowMyLocal");

// Initializing database tables
await DbInit.init();

// Middleware to check the request coming from website
app.Use(async (HttpContext context, RequestDelegate next) =>
{
    if (context.Request.Headers["x-api-key"] == "authorized api key")
    {
        await next(context);
    }
    else
    {
        return;
    }
});

app.MapControllers();

app.Run();
