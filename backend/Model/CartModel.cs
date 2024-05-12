// Cart Model
using System.ComponentModel.DataAnnotations;
public class Cart
{
    [Key]
    public int cart_id {get; set;}
    public int user_id {get; set;}
    public int product_id {get; set;}
}
