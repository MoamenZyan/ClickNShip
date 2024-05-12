using System.ComponentModel.DataAnnotations;
public class EmailVerify
{
    [Key]
    public int email_verify_id {get; set;}
    public string? user_email {get; set;}
    public int secret_code {get; set;}
}