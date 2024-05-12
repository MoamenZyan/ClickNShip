
using System.ComponentModel.DataAnnotations;

public class Favorite
{
    [Key]
    public int favorite_id {get; set;}
    public int user_id {get; set;}
    public int product_id {get; set;}
}
