// Payment Model

public class Payment
{
    public int PaymentId {get; set;}
    public int UserId {get; set;}
    public decimal PaymentTotal {get; set;}
    public string? PaymentMethod {get; set;}
}
