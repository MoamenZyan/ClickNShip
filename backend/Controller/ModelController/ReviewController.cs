using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

public class ReviewController : Controller
{
    private readonly ApplicationDbContext _context;
    public JwtService jwtService = new JwtService("your secret key");

    public ReviewController(ApplicationDbContext context)
    {
        this._context = context;
    }

    [HttpPost("/api/v1/reviews")]
    public async Task<IActionResult> CreateReview()
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var FormData = await new FormReader(Request.Body).ReadFormAsync();
            var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            var product = await _context.product.FirstOrDefaultAsync(p => p.product_id == Convert.ToInt32(FormData["product_id"]));
            Review review = new Review
            {
                review_content = FormData["review_content"],
                user_id = userId,
                product_id = Convert.ToInt32(FormData["product_id"]),
                review_likes = 0,
                review_dislikes = 0,
                review_rate = Convert.ToInt32(FormData["review_rate"]),
                review_date = DateTime.Now,
                review_image = "null"
            };
            if (FormData["review_image"] != "null") {
                review.review_image = FormData["review_image"];
            }
            await _context.review.AddAsync(review);
            await _context.SaveChangesAsync();
            return Created();
        }
        else
        {
            return Unauthorized();
        }
    }

    [HttpGet("/api/v1/reviews")]
    public async Task<IActionResult> GetReviews([FromQuery]int id = default(int))
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            if (id != default(int))
            {
                    var result = await (from review in _context.review
                        join reviewReaction in _context.review_reaction 
                        on review.review_id equals reviewReaction.review_id into reactions
                        from reviewReaction in reactions.Where(r => r.user_id == userId).DefaultIfEmpty()
                        where review.product_id == id
                        select new
                        {
                            review.review_id,
                            review.user_id,
                            review.review_content,
                            review.review_likes,
                            review.review_dislikes,
                            review.review_date,
                            review.review_rate,
                            reaction_type = reviewReaction == null ? null : reviewReaction.reaction_type
                        }).ToListAsync();
                return new JsonResult(new {status="true",data=result});
            }
            else
            {
                var reviews = await _context.review.ToListAsync();
                return new JsonResult(new {status="true",data=reviews});
            }
        }
        else
        {
            return Unauthorized();
        }
    }

    [HttpPatch("/api/v1/reviews")]
    public async Task<IActionResult> EditReview([FromQuery]int id, [FromBody]object data)
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            var review = await _context.review.FirstOrDefaultAsync(r => r.review_id == id && r.user_id == userId);
            if (review != null)
            {
                dynamic jsonData = JObject.Parse(data.ToString());
                string review_content = jsonData["textData"];
                review.review_content = review_content;
                _context.review.Update(review);
                await _context.SaveChangesAsync();
                return StatusCode(200);
            }
        }
        return StatusCode(409);
    }

    [HttpGet("/api/v1/onereview")]
    public async Task<IActionResult> GetOneReview([FromQuery]int id = default(int))
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await (from Review in _context.review join
                ReviewReaction in _context.review_reaction on new {Review.review_id, Review.user_id}
                equals new {ReviewReaction.review_id, ReviewReaction.user_id} into reactions from ReviewReaction in reactions.DefaultIfEmpty()
                where Review.review_id == id
                select new
                {
                    Review.review_id,
                    Review.user_id,
                    Review.review_content,
                    Review.review_likes,
                    Review.review_dislikes,
                    Review.review_rate,
                    Review.review_date,
                    ReviewReaction.reaction_type,
                    Review.review_image
                }
            ).ToListAsync();
            return new JsonResult(new {status="true",data=result});
        }
        else
        {
            return Unauthorized();
        }
    }

    [HttpPatch("/api/v1/reviews/{review_id}/like")]
    public async Task<IActionResult> LikeReview(int review_id)
    {
        Console.WriteLine("hello");
        var token = Request.Cookies["jwt"];
        Review review = await _context.review.FirstOrDefaultAsync(r => r.review_id == review_id);
        var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
        if (token != null)
        {
            try
            {
                var past_reaction = await _context.review_reaction.FirstOrDefaultAsync(r => r.user_id == userId && r.review_id == review_id);
                if (past_reaction != null)
                {
                    if (past_reaction.reaction_type == "dislike")
                    {
                        past_reaction.reaction_type = "like";
                        if (review.review_dislikes > 0)
                        {
                            review.review_dislikes--;
                        }
                        review.review_likes++;
                        _context.review_reaction.Update(past_reaction);
                        _context.review.Update(review);
                        await _context.SaveChangesAsync();
                        return new JsonResult(new {status = "true"}){StatusCode=200};
                    }
                    else
                    {
                        if (review.review_likes > 0)
                        {
                            review.review_likes--;
                        }
                        _context.review_reaction.Remove(past_reaction);
                        return new JsonResult(new {status = "true"}){StatusCode=200};
                    }
                }
                else
                {
                    review.review_likes++;
                    ReviewReaction reviewReaction = new ReviewReaction()
                    {
                        user_id = userId,
                        review_id = review_id,
                        reaction_type = "like"
                    };
                    _context.review.Update(review);
                    await _context.review_reaction.AddAsync(reviewReaction);
                    await _context.SaveChangesAsync();
                    return new JsonResult(new {status="true"}){StatusCode=200};
                }
            }
            catch(Exception err)
            {
                Console.WriteLine(err);
                return new JsonResult(new {status="false", message="internal server error"}){StatusCode=500};
            }
            finally
            {
                await _context.SaveChangesAsync();
            }
        }
        return Unauthorized();
    }

    [HttpPatch("/api/v1/reviews/{review_id}/dislike")]
    public async Task<IActionResult> DislikeReview(int review_id)
    {
        var token = Request.Cookies["jwt"];
        Review review = await _context.review.FirstOrDefaultAsync(r => r.review_id == review_id);
        var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
        if (token != null)
        {
            try
            {
                var past_reaction = await _context.review_reaction.FirstOrDefaultAsync(r => r.user_id == userId && r.review_id == review_id);
                if (past_reaction != null)
                {
                    if (past_reaction.reaction_type == "like")
                    {
                        past_reaction.reaction_type = "dislike";
                        review.review_dislikes++;
                        if (review.review_likes > 0)
                        {
                            review.review_likes--;
                        }
                        _context.review_reaction.Update(past_reaction);
                        _context.review.Update(review);
                        await _context.SaveChangesAsync();
                        return new JsonResult(new {status = "true"}){StatusCode=200};
                    }
                    else
                    {
                        if (review.review_dislikes > 0)
                        {
                            review.review_dislikes--;
                        }
                        _context.review_reaction.Remove(past_reaction);
                        return new JsonResult(new {status = "true"}){StatusCode=200};
                    }
                }
                else
                {
                    review.review_dislikes++;
                    ReviewReaction reviewReaction = new ReviewReaction()
                    {
                        user_id = userId,
                        review_id = review_id,
                        reaction_type = "dislike"
                    };
                    _context.review.Update(review);
                    await _context.review_reaction.AddAsync(reviewReaction);
                    await _context.SaveChangesAsync();
                    return new JsonResult(new {status="true"}){StatusCode=200};
                }
            }
            catch(Exception err)
            {
                Console.WriteLine(err);
                return new JsonResult(new {status="false", message="internal server error"}){StatusCode=500};
            }
            finally
            {
                await _context.SaveChangesAsync();
            }
        }
        return Unauthorized();
    }

    [HttpDelete("/api/v1/reviews")]
    public async Task<IActionResult> DeleteReview([FromQuery]int id)
    {
        var token = Request.Cookies["jwt"];
        if (token != null)
        {
            var userId = Convert.ToInt32(jwtService.verifyToken(token).FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userId != null)
            {
                var review = await _context.review.FirstOrDefaultAsync(r => r.review_id == id && r.user_id == userId);
                if (review != null)
                {
                    var review_reactions = await _context.review_reaction.Where(r => r.review_id == id).ToListAsync();
                    _context.review_reaction.RemoveRange(review_reactions);
                    await _context.SaveChangesAsync();
                    _context.review.Remove(review);
                    await _context.SaveChangesAsync();
                }
                return new JsonResult(new {status="true", message="deleted"}){StatusCode=200};
            }
        }
        return Unauthorized();
    }
}
