require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('../models/db');

const TARGETS = {
  categories: 10,
  products: 50,
  customers: 100,
  orders: 300,
  orderItems: 1000,
  promotions: 10,
  tables: 16,
};

const categoryData = [
  ['Coffee', '#7C3F2C'],
  ['Tea', '#C27C2C'],
  ['Cold Beverages', '#1D7A8C'],
  ['Breakfast', '#E76F51'],
  ['Sandwiches', '#2A9D8F'],
  ['Snacks', '#D9A441'],
  ['Meals', '#5F8D4E'],
  ['Bakery', '#B66D50'],
  ['Desserts', '#C44569'],
  ['Combos', '#4B6CB7'],
];

const productData = [
  ['Classic Cappuccino', 'Coffee', 125, '5', 'Espresso with steamed milk and foam'],
  ['Cafe Latte', 'Coffee', 135, '5', 'Smooth espresso with milk'],
  ['Americano', 'Coffee', 110, '5', 'Espresso topped with hot water'],
  ['Mocha', 'Coffee', 155, '5', 'Coffee, cocoa, and steamed milk'],
  ['Caramel Macchiato', 'Coffee', 175, '5', 'Espresso with caramel and milk foam'],
  ['Filter Coffee', 'Coffee', 75, '5', 'South Indian filter coffee'],
  ['Espresso Shot', 'Coffee', 85, '5', 'Single-origin espresso shot'],
  ['Cold Brew', 'Coffee', 165, '5', 'Slow-steeped cold coffee'],
  ['Masala Chai', 'Tea', 45, '5', 'Spiced milk tea'],
  ['Ginger Tea', 'Tea', 50, '5', 'Tea simmered with fresh ginger'],
  ['Elaichi Tea', 'Tea', 55, '5', 'Cardamom milk tea'],
  ['Green Tea', 'Tea', 65, '5', 'Light brewed green tea'],
  ['Lemon Iced Tea', 'Tea', 95, '5', 'Chilled black tea with lemon'],
  ['Peach Iced Tea', 'Tea', 105, '5', 'Chilled peach tea'],
  ['Fresh Lime Soda', 'Cold Beverages', 90, '5', 'Sweet and salted lime soda'],
  ['Mango Smoothie', 'Cold Beverages', 155, '5', 'Mango yogurt smoothie'],
  ['Chocolate Shake', 'Cold Beverages', 165, '5', 'Chocolate milkshake'],
  ['Strawberry Shake', 'Cold Beverages', 165, '5', 'Strawberry milkshake'],
  ['Watermelon Cooler', 'Cold Beverages', 120, '5', 'Fresh watermelon cooler'],
  ['Poha Bowl', 'Breakfast', 85, '5', 'Flattened rice with peanuts and herbs'],
  ['Idli Sambar', 'Breakfast', 105, '5', 'Steamed idlis with sambar'],
  ['Masala Dosa', 'Breakfast', 145, '5', 'Crisp dosa with potato filling'],
  ['Cheese Omelette', 'Breakfast', 135, '5', 'Three-egg omelette with cheese'],
  ['Aloo Paratha Curd', 'Breakfast', 135, '5', 'Stuffed paratha with curd'],
  ['Veg Grilled Sandwich', 'Sandwiches', 135, '5', 'Grilled vegetable sandwich'],
  ['Paneer Tikka Sandwich', 'Sandwiches', 175, '5', 'Paneer tikka sandwich'],
  ['Chicken Club Sandwich', 'Sandwiches', 225, '5', 'Layered chicken club sandwich'],
  ['Corn Cheese Sandwich', 'Sandwiches', 155, '5', 'Corn and cheese grilled sandwich'],
  ['Samosa Plate', 'Snacks', 60, '5', 'Two crispy potato samosas'],
  ['Veg Puff', 'Snacks', 55, '5', 'Flaky vegetable puff'],
  ['Paneer Puff', 'Snacks', 75, '5', 'Flaky paneer puff'],
  ['French Fries', 'Snacks', 125, '5', 'Crisp salted fries'],
  ['Peri Peri Fries', 'Snacks', 145, '5', 'Spiced peri peri fries'],
  ['Veg Burger', 'Snacks', 165, '5', 'Vegetable patty burger'],
  ['Paneer Wrap', 'Meals', 210, '5', 'Paneer wrap with salad'],
  ['Veg Thali', 'Meals', 260, '5', 'Rice, roti, dal, sabzi, and salad'],
  ['Rajma Rice Bowl', 'Meals', 195, '5', 'Rajma curry over steamed rice'],
  ['Paneer Butter Masala Meal', 'Meals', 295, '5', 'Paneer curry with rice or roti'],
  ['White Sauce Pasta', 'Meals', 245, '5', 'Creamy vegetable pasta'],
  ['Chocolate Croissant', 'Bakery', 145, '5', 'Buttery croissant with chocolate'],
  ['Blueberry Muffin', 'Bakery', 125, '5', 'Fresh blueberry muffin'],
  ['Banana Walnut Cake', 'Bakery', 135, '5', 'Slice of banana walnut cake'],
  ['Garlic Bread', 'Bakery', 115, '5', 'Toasted garlic bread'],
  ['Chocolate Brownie', 'Desserts', 135, '5', 'Warm chocolate brownie'],
  ['Gulab Jamun', 'Desserts', 95, '5', 'Two pieces of gulab jamun'],
  ['Cheesecake Slice', 'Desserts', 185, '5', 'Classic baked cheesecake'],
  ['Tiramisu Cup', 'Desserts', 195, '5', 'Coffee-flavoured dessert cup'],
  ['Chai Samosa Combo', 'Combos', 95, '5', 'Masala chai with samosa'],
  ['Breakfast Combo', 'Combos', 225, '5', 'Poha, chai, and fruit cup'],
  ['Lunch Combo', 'Combos', 375, '5', 'Meal bowl, drink, and dessert'],
];

const promotionData = [
  ['Welcome 10 Percent Off', 'coupon', 'WELCOME10', 'percentage', 10, null, 250, true],
  ['Cafe 50 Off', 'coupon', 'CAFE50', 'fixed', 50, null, 450, true],
  ['Lunch Saver', 'order_promo', null, 'percentage', 5, null, 600, true],
  ['Big Table Bonus', 'order_promo', null, 'fixed', 75, null, 900, true],
  ['Tea Pair Offer', 'product_promo', null, 'fixed', 20, 2, null, true],
  ['Dessert Add On', 'product_promo', null, 'percentage', 8, 2, null, true],
  ['Weekend Brunch', 'coupon', 'BRUNCH15', 'percentage', 15, null, 700, true],
  ['Student Sip', 'coupon', 'STUDENT25', 'fixed', 25, null, 200, true],
  ['Inactive Old Coupon', 'coupon', 'OLDCAFE', 'percentage', 20, null, 500, false],
  ['Family Combo Deal', 'order_promo', null, 'percentage', 7, null, 1000, true],
];

const firstNames = [
  'Aarav', 'Aditi', 'Akash', 'Ananya', 'Arjun', 'Diya', 'Ishaan', 'Kavya',
  'Meera', 'Neha', 'Nikhil', 'Priya', 'Rahul', 'Rohan', 'Saanvi', 'Tanvi',
  'Varun', 'Vihaan', 'Zoya', 'Riya',
];
const lastNames = [
  'Sharma', 'Patel', 'Mehta', 'Iyer', 'Nair', 'Joshi', 'Desai', 'Kapoor',
  'Rao', 'Bose', 'Kulkarni', 'Malhotra', 'Chopra', 'Menon', 'Trivedi',
];

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function roundMoney(value) {
  return Number(Number(value).toFixed(2));
}

function sqlDate(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function randomRecentDate(index) {
  const now = new Date();
  const dayOffset = Math.floor(Math.random() * 30);
  const date = new Date(now);
  date.setDate(now.getDate() - dayOffset);

  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const hourBuckets = isWeekend
    ? [9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21]
    : [8, 9, 10, 12, 13, 14, 16, 17, 18, 19, 20];

  date.setHours(hourBuckets[index % hourBuckets.length]);
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));
  date.setMilliseconds(0);

  return date;
}

function weightedProduct(products, date) {
  const hour = date.getHours();
  const preferredCategories =
    hour < 11
      ? ['Coffee', 'Tea', 'Breakfast', 'Bakery', 'Combos']
      : hour < 16
        ? ['Meals', 'Sandwiches', 'Cold Beverages', 'Combos', 'Snacks']
        : ['Coffee', 'Tea', 'Snacks', 'Desserts', 'Cold Beverages', 'Combos'];

  const preferred = products.filter((product) =>
    preferredCategories.includes(product.category_name)
  );

  return Math.random() < 0.75 ? pick(preferred) : pick(products);
}

function buildCustomers() {
  return Array.from({ length: TARGETS.customers }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const suffix = String(index + 1).padStart(3, '0');

    return [
      `${firstName} ${lastName}`,
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@demo.cafe`,
      `98${String(70000000 + index).padStart(8, '0')}`,
      sqlDate(randomRecentDate(index)),
    ];
  });
}

function buildOrderNumber(date, index) {
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('');

  return `DEMO-${datePart}-${String(index + 1).padStart(4, '0')}`;
}

function calculateDiscount(subtotal, orderIndex, promotions) {
  const eligible = [];

  if (subtotal >= 250 && orderIndex % 9 === 0) {
    eligible.push(promotions.find((promotion) => promotion.coupon_code === 'WELCOME10'));
  }

  if (subtotal >= 450 && orderIndex % 11 === 0) {
    eligible.push(promotions.find((promotion) => promotion.coupon_code === 'CAFE50'));
  }

  if (subtotal >= 600 && orderIndex % 5 === 0) {
    eligible.push(promotions.find((promotion) => promotion.name === 'Lunch Saver'));
  }

  if (subtotal >= 900 && orderIndex % 13 === 0) {
    eligible.push(promotions.find((promotion) => promotion.name === 'Big Table Bonus'));
  }

  const activePromotions = eligible.filter(Boolean).slice(0, 2);
  const discount = activePromotions.reduce((total, promotion) => {
    const value = Number(promotion.discount_value);
    const amount =
      promotion.discount_type === 'percentage' ? subtotal * (value / 100) : value;

    return total + amount;
  }, 0);

  return {
    discountAmount: Math.min(roundMoney(discount), subtotal),
    promotionIds: activePromotions.map((promotion) => promotion.id),
  };
}

async function ensureUserAndPayments(connection) {
  const password = await bcrypt.hash('admin123', 10);

  await connection.query(
    `INSERT INTO users (name, email, password, role, status)
     VALUES ('Admin User', 'admin@cafepos.com', ?, 'admin', 'active')
     ON DUPLICATE KEY UPDATE role = 'admin', status = 'active'`,
    [password]
  );

  await connection.query(
    `INSERT INTO payment_methods (name, type, upi_id, is_active)
     VALUES
       ('Cash', 'cash', NULL, TRUE),
       ('UPI', 'upi', NULL, TRUE),
       ('Card', 'card', NULL, TRUE)`
  );

  const [[user]] = await connection.query(
    "SELECT id FROM users WHERE email = 'admin@cafepos.com' LIMIT 1"
  );
  const [payments] = await connection.query(
    'SELECT id, name, type FROM payment_methods WHERE is_active = TRUE'
  );

  return {
    userId: user.id,
    payments,
  };
}

async function clearDemoData(connection) {
  await connection.query('DELETE FROM order_promotions');
  await connection.query('DELETE FROM order_items');
  await connection.query('DELETE FROM orders');
  await connection.query('DELETE FROM payment_methods');
  await connection.query('DELETE FROM products');
  await connection.query('DELETE FROM product_categories');
  await connection.query('DELETE FROM customers');
  await connection.query('DELETE FROM promotions');
  await connection.query('DELETE FROM cafe_tables');
}

async function seedDemoData() {
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await clearDemoData(connection);
    const { userId, payments } = await ensureUserAndPayments(connection);

    await connection.query(
      'INSERT INTO product_categories (name, color) VALUES ?',
      [categoryData]
    );

    const [categories] = await connection.query(
      'SELECT id, name FROM product_categories ORDER BY id ASC'
    );
    const categoryMap = new Map(categories.map((category) => [category.name, category.id]));

    await connection.query(
      `INSERT INTO products
        (name, category_id, price, tax_rate, description, is_archived)
       VALUES ?`,
      [
        productData.map(([name, categoryName, price, taxRate, description]) => [
          name,
          categoryMap.get(categoryName),
          price,
          taxRate,
          description,
          false,
        ]),
      ]
    );

    await connection.query(
      `INSERT INTO customers (name, email, phone, created_at)
       VALUES ?`,
      [buildCustomers()]
    );

    await connection.query(
      `INSERT INTO promotions
        (name, type, coupon_code, discount_type, discount_value,
         min_qty, min_order_amount, is_active)
       VALUES ?`,
      [promotionData]
    );

    await connection.query(
      'INSERT INTO cafe_tables (table_number, status) VALUES ?',
      [
        Array.from({ length: TARGETS.tables }, (_, index) => [
          index + 1,
          index < 4 ? 'occupied' : 'available',
        ]),
      ]
    );

    const [products] = await connection.query(
      `SELECT p.id, p.name, p.price, p.tax_rate, pc.name AS category_name
       FROM products p
       INNER JOIN product_categories pc ON pc.id = p.category_id`
    );
    const [customers] = await connection.query('SELECT id FROM customers');
    const [tables] = await connection.query('SELECT id FROM cafe_tables');
    const [promotions] = await connection.query('SELECT * FROM promotions');

    const orderValues = [];
    const itemRowsByOrderIndex = [];
    const orderPromotionRowsByIndex = [];

    for (let orderIndex = 0; orderIndex < TARGETS.orders; orderIndex += 1) {
      const createdAt = randomRecentDate(orderIndex);
      const itemCount = orderIndex < 100 ? 4 : 3;
      const orderItems = [];
      const usedProductIds = new Set();

      while (orderItems.length < itemCount) {
        const product = weightedProduct(products, createdAt);

        if (usedProductIds.has(product.id)) {
          continue;
        }

        usedProductIds.add(product.id);
        const quantity = Math.random() < 0.78 ? 1 : Math.random() < 0.92 ? 2 : 3;
        const unitPrice = Number(product.price);
        const lineTotal = roundMoney(unitPrice * quantity);

        orderItems.push({
          productId: product.id,
          quantity,
          unitPrice,
          taxRate: String(product.tax_rate),
          lineTotal,
        });
      }

      const subtotal = roundMoney(
        orderItems.reduce((total, item) => total + item.lineTotal, 0)
      );
      const taxAmount = roundMoney(
        orderItems.reduce(
          (total, item) => total + item.lineTotal * (Number(item.taxRate) / 100),
          0
        )
      );
      const { discountAmount, promotionIds } = calculateDiscount(
        subtotal,
        orderIndex,
        promotions
      );
      const totalAmount = roundMoney(subtotal + taxAmount - discountAmount);
      const payment = pick(payments);
      const customer = Math.random() < 0.86 ? pick(customers) : null;
      const table = Math.random() < 0.7 ? pick(tables) : null;
      const createdAtSql = sqlDate(createdAt);

      orderValues.push([
        buildOrderNumber(createdAt, orderIndex),
        customer ? customer.id : null,
        userId,
        payment.id,
        table ? table.id : null,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        'paid',
        'completed',
        createdAtSql,
        createdAtSql,
      ]);
      itemRowsByOrderIndex.push(orderItems);
      orderPromotionRowsByIndex.push(promotionIds);
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders
        (order_number, customer_id, user_id, payment_method_id, table_id,
         subtotal, tax_amount, discount_amount, total_amount, status,
         kds_status, created_at, updated_at)
       VALUES ?`,
      [orderValues]
    );

    const itemValues = [];
    const orderPromotionValues = [];

    itemRowsByOrderIndex.forEach((items, orderIndex) => {
      const orderId = orderResult.insertId + orderIndex;

      items.forEach((item) => {
        itemValues.push([
          orderId,
          item.productId,
          item.quantity,
          item.unitPrice,
          item.taxRate,
          item.lineTotal,
          orderValues[orderIndex][11],
        ]);
      });

      orderPromotionRowsByIndex[orderIndex].forEach((promotionId) => {
        orderPromotionValues.push([orderId, promotionId]);
      });
    });

    await connection.query(
      `INSERT INTO order_items
        (order_id, product_id, quantity, unit_price, tax_rate, line_total, created_at)
       VALUES ?`,
      [itemValues]
    );

    if (orderPromotionValues.length > 0) {
      await connection.query(
        'INSERT INTO order_promotions (order_id, promotion_id) VALUES ?',
        [orderPromotionValues]
      );
    }

    await connection.commit();

    const [summaryRows] = await db.query(
      `SELECT
         (SELECT COUNT(*) FROM product_categories) AS categories,
         (SELECT COUNT(*) FROM products) AS products,
         (SELECT COUNT(*) FROM customers) AS customers,
         (SELECT COUNT(*) FROM orders) AS orders,
         (SELECT COUNT(*) FROM order_items) AS orderItems,
         (SELECT COUNT(*) FROM promotions) AS promotions,
         (SELECT COUNT(*) FROM cafe_tables) AS tables,
         (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'paid') AS revenue,
         (SELECT COALESCE(AVG(total_amount), 0) FROM orders WHERE status = 'paid') AS averageOrderValue`
    );
    const [exampleRows] = await db.query(
      `SELECT o.order_number, c.name AS customer_name, o.total_amount, o.created_at
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       ORDER BY o.created_at DESC
       LIMIT 3`
    );

    return {
      summary: summaryRows[0],
      examples: exampleRows,
    };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
    await db.end();
  }
}

seedDemoData()
  .then(({ summary, examples }) => {
    console.log('Demo seed completed.');
    console.table({
      categories: summary.categories,
      products: summary.products,
      customers: summary.customers,
      orders: summary.orders,
      orderItems: summary.orderItems,
      promotions: summary.promotions,
      tables: summary.tables,
      revenue: Number(summary.revenue).toFixed(2),
      averageOrderValue: Number(summary.averageOrderValue).toFixed(2),
    });
    console.log('Example orders:');
    console.table(examples);
  })
  .catch((error) => {
    console.error('Demo seed failed.');
    console.error(error);
    process.exitCode = 1;
  });
