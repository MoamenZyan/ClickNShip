using Microsoft.EntityFrameworkCore;

// Database Context (ORM)
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options){}
    public DbSet<User> user {get; set;}
    public DbSet<Product> product {get; set;}
    public DbSet<Payment> payment {get; set;}
    public DbSet<Review> review {get; set;}
    public DbSet<Cart> cart {get; set;}
    public DbSet<EmailVerify> email_verify {get; set;}
    public DbSet<ReviewReaction> review_reaction {get; set;}
    public DbSet<Order> user_order {get; set;}
    public DbSet<Favorite> favorite {get; set;}
    public DbSet<ResetPassword> reset_password {get; set;}
}
