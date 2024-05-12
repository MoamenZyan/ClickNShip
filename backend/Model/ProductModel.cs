// Product Model
using System.ComponentModel.DataAnnotations;
public class Product
{
    [Key]
    public int product_id {get; set;}
    public int user_id {get; set;}
    public DateTime product_created_at {get; set;}
    public bool product_sale {get; set;}
    public decimal product_before_price {get; set;}
    public string? product_name {get; set;}
    public string? product_image {get; set;}
    public string? product_description {get; set;}
    public decimal product_price {get; set;}
    public int product_rate {get; set;}
    public string? product_brand {get; set;}
    public string? product_size {get; set;}
    public string? product_weight {get; set;}
    public string? product_delivery {get; set;}
    public string? product_category {get; set;}
    public string? product_color {get; set;}
    public int? product_charging_time {get; set;}
    public string? product_compatible_devices {get; set;}
    public string? product_connectivity {get; set;}
    public int? product_number_of_usb {get; set;}
    public string? product_cpu {get; set;}
    public string? product_storage_type {get; set;}
    public int? product_storage {get; set;}
    public int? product_ram {get; set;}
    public string? product_battery_description {get; set;}
    public int? product_camera {get; set;}
    public string? product_operating_system {get; set;}
    public string? product_resolution {get; set;}
    public string? product_battery_included {get; set;}
    public int? product_screen_refresh_rate {get; set;}
    public string? product_screen_size {get; set;}
    public string? product_is_smart {get; set;}
    public string? product_display_technology {get; set;}

}
