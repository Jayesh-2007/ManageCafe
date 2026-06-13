INSERT IGNORE INTO users (name, email, password, role, status)
VALUES ('Admin User', 'admin@cafepos.com', 'HASH_ME_LATER', 'admin', 'active');

INSERT IGNORE INTO product_categories (name, color)
VALUES
  ('Beverages', '#4F8A8B'),
  ('Snacks', '#F6C85F'),
  ('Meals', '#6B8E23');

INSERT IGNORE INTO products (name, category_id, price, tax_rate, description, is_archived)
VALUES
  (
    'Masala Tea',
    (SELECT id FROM product_categories WHERE name = 'Beverages'),
    25.00,
    '5',
    'Spiced Indian tea',
    FALSE
  ),
  (
    'Coffee',
    (SELECT id FROM product_categories WHERE name = 'Beverages'),
    40.00,
    '5',
    'Fresh brewed coffee',
    FALSE
  ),
  (
    'Veg Sandwich',
    (SELECT id FROM product_categories WHERE name = 'Snacks'),
    90.00,
    '5',
    'Vegetable sandwich',
    FALSE
  );

INSERT IGNORE INTO payment_methods (name, type, upi_id, is_active)
VALUES
  ('Cash', 'cash', NULL, TRUE),
  ('UPI', 'upi', NULL, TRUE),
  ('Card', 'card', NULL, TRUE);

INSERT IGNORE INTO cafe_tables (table_number, status)
VALUES
  (1, 'available'),
  (2, 'available'),
  (3, 'available'),
  (4, 'available'),
  (5, 'available'),
  (6, 'available'),
  (7, 'available'),
  (8, 'available'),
  (9, 'available'),
  (10, 'available'),
  (11, 'available'),
  (12, 'available'),
  (13, 'available'),
  (14, 'available'),
  (15, 'available'),
  (16, 'available');
