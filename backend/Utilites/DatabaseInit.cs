// initialize database when starting the server
using MySql.Data.MySqlClient;
using Mysqlx.Connection;
public class DbInit()
{
    public static async Task init() // Database tables initializing method
    {
        string[] queries = 
        {
            "CREATE TABLE IF NOT EXISTS user (user_id INT PRIMARY KEY AUTO_INCREMENT, user_name VARCHAR(30) UNIQUE, user_password VARCHAR(60), user_email VARCHAR(60) UNIQUE, user_phone VARCHAR(11) UNIQUE, user_address VARCHAR(20), user_photo TEXT)",
            "CREATE TABLE IF NOT EXISTS product (product_id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, product_name VARCHAR(250), product_image VARCHAR(255), product_description TEXT, product_price DECIMAL(10,2), product_rate INT, product_brand TEXT, product_size TEXT, product_weight TEXT, product_delivery TEXT, product_category TEXT, product_color TEXT DEFAULT NULL, product_charging_time INT DEFAULT NULL, product_compatible_devices TEXT DEFAULT NULL, product_connectivity TEXT DEFAULT NULL, product_number_of_usb TEXT DEFAULT NULL, product_cpu TEXT DEFAULT NULL, product_storage_type TEXT DEFAULT NULL, product_storage INT DEFAULT NULL, product_ram INT DEFAULT NULL, product_battery_description TEXT DEFAULT NULL, product_camera INT DEFAULT NULL, product_operating_system TEXT DEFAULT NULL, product_resolution TEXT DEFAULT NULL, product_battery_included TEXT DEFAULT NULL, product_screen_refresh_rate TEXT DEFAULT NULL, product_screen_size TEXT DEFAULT NULL, product_is_smart TEXT DEFAULT NULL, product_created_at DATETIME, product_sale BOOLEAN DEFAULT FALSE, product_before_price DECIMAL(10,2) DEFAULT 0, product_display_technology TEXT DEFAULT NULL, FOREIGN KEY (user_id) REFERENCES user(user_id))",
            "CREATE TABLE IF NOT EXISTS payment (payment_id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, payment_total DECIMAL(10,2), payment_method TEXT, FOREIGN KEY (user_id) REFERENCES user(user_id))",
            "CREATE TABLE IF NOT EXISTS review (review_id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, product_id INT, review_image TEXT,review_content TEXT, review_likes INT DEFAULT (0), review_dislikes INT DEFAULT(0), review_rate INT, review_date DATETIME, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (product_id) REFERENCES product(product_id))",
            "CREATE TABLE IF NOT EXISTS review_reaction (reaction_id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, review_id INT, reaction_type ENUM('like', 'dislike'), FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (review_id) REFERENCES review(review_id))",
            "CREATE TABLE IF NOT EXISTS cart (cart_id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, product_id INT, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (product_id) REFERENCES product(product_id))",
            "CREATE TABLE IF NOT EXISTS email_verify (email_verify_id INT PRIMARY KEY AUTO_INCREMENT, user_email VARCHAR(60) UNIQUE, secret_code VARCHAR(6))",
            "CREATE TABLE IF NOT EXISTS user_order (order_id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, product_id INT, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (product_id) REFERENCES product(product_id))",
            "CREATE TABLE IF NOT EXISTS favorite (favorite_id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, product_id INT, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (product_id) REFERENCES product(product_id))",
            "CREATE TABLE IF NOT EXISTS reset_password (reset_id INT PRIMARY KEY AUTO_INCREMENT, user_email VARCHAR(60), url_id TEXT, user_id INT, FOREIGN KEY (user_email) REFERENCES user(user_email), FOREIGN KEY (user_id) REFERENCES user(user_id))"
        };
        var connection = new MySqlConnection("your connection string");
        await connection.OpenAsync();
        foreach(string query in queries)
        {
            var commands = new MySqlCommand(query, connection);
            await commands.ExecuteNonQueryAsync();
        }
        await connection.CloseAsync();
    }
}
