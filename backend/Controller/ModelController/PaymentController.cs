

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Stripe;

public class PaymentController : Controller
{
    private readonly StripeClient _stripeClient;
    private readonly PaymentIntentService _paymentIntentService;
    public PaymentController(StripeClient stripeClient, PaymentIntentService paymentIntentService)
    {
        _stripeClient = stripeClient;
        _paymentIntentService = paymentIntentService;
    }

    [HttpPost("/api/v1/payment-intent")]
    public async Task<IActionResult> CreatePaymentIntent()
    {
        var body = await new FormReader(Request.Body).ReadFormAsync();
        var options = new PaymentIntentCreateOptions
        {
            Amount = Convert.ToInt32(body["amount"]) * 100,
            Currency = "usd",
        };
        var paymentIntent = _paymentIntentService.Create(options);
        return Ok(new {clientSecret = paymentIntent.ClientSecret});
    }
}