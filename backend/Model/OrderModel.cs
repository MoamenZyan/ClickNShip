using System.ComponentModel.DataAnnotations;
public class Order
{
    [Key]
    public int order_id {get; set;}
    public int user_id {get; set;}
    public int product_id {get; set;}
}
