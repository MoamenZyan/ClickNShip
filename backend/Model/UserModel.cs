// User Model
using System.ComponentModel.DataAnnotations;
public class User
{
    [Key]
    public int user_id {get; set;}
    public string? user_name {get; set;}
    public string? user_photo {get; set;}
    public string? user_password {get; set;}
    public string? user_email {get; set;}
    public string? user_phone {get; set;}
    public string? user_address {get; set;}
}
