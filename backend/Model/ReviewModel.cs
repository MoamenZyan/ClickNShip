// Review Model
using System.ComponentModel.DataAnnotations;

public class Review
{
    [Key]
    public int review_id {get; set;}
    public int user_id {get; set;}
    public int product_id {get; set;}
    public string? review_image {get; set;}
    public string? review_content {get; set;}
    public int review_likes {get; set;}
    public int review_dislikes {get; set;}
    public int review_rate {get; set;}
    public DateTime review_date {get; set;}
}
