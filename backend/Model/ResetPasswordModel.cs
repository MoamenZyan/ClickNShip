using System.ComponentModel.DataAnnotations;

public class ResetPassword
{
    [Key]
    public int reset_id {get; set;}
    public int user_id {get; set;}
    public string? user_email {get; set;}
    public string? url_id {get; set;}
}
