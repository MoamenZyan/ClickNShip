using System;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Mail;

public static class OTP
{
    public static int RandomIntNumbers()
    {
        Random random = new Random();
        string number = Convert.ToString(random.NextInt64()).Substring(0, 6);
        return Convert.ToInt32(number);
    }
}

public class MailService
{
    public static async Task sendMail(string mail, int secretCode)
    {
        try
        {
            var api_key = "your api key";
            var client = new SendGridClient(api_key);
            var from = new EmailAddress("your email", "your email name");
            var subject = "slogan";
            var to = new EmailAddress(mail);
            var body = "";
            var htmlContent = $"<h1>Verification Code: {secretCode}</h1>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, body, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }
        catch (Exception err)
        {
            Console.WriteLine(err);
        }
    }
    public static async Task sendUrl(string mail, string guid, int user_id)
    {
        try
        {
            var api_key = "your api key";
            var client = new SendGridClient(api_key);
            var from = new EmailAddress("your email", "your email name");
            var subject = "your slogan";
            var to = new EmailAddress(mail);
            var body = "";
            var htmlContent = $"<h3>Reset Password URL: http://example.com/reset/{user_id}/{guid}</h3>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, body, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }
        catch (Exception err)
        {
            Console.WriteLine(err);
        }
    }
}