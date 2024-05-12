using System.ComponentModel.DataAnnotations;


public class ReviewReaction
{
    [Key]
    public int reaction_id {get; set;}
    public int user_id {get; set;}
    public int review_id {get; set;}
    public string reaction_type {get; set;}
}