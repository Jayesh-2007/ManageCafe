const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cafe POS API',
      version: '1.0.0',
      description:
        'Backend API for Cafe POS System built for Odoo x Parul University Hackathon.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication and current user APIs' },
      { name: 'Categories', description: 'Product category management' },
      { name: 'Products', description: 'Product catalog management' },
      { name: 'Customers', description: 'Customer management' },
      { name: 'Orders', description: 'POS orders and cart lifecycle' },
      { name: 'KDS', description: 'Kitchen display system' },
      { name: 'Promotions', description: 'Coupons and promotions' },
      { name: 'Reports', description: 'Admin reports and analytics' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'User registered successfully' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@cafepos.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Jayesh Hadiyal' },
            email: { type: 'string', example: 'jayesh@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        CategoryRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Beverages' },
            color: { type: 'string', example: '#2563EB' },
          },
        },
        ProductRequest: {
          type: 'object',
          required: ['name', 'category_id', 'price', 'tax_rate'],
          properties: {
            name: { type: 'string', example: 'Masala Tea' },
            category_id: { type: 'integer', example: 1 },
            price: { type: 'number', example: 20 },
            tax_rate: { type: 'string', enum: ['5', '18', '28'], example: '5' },
            description: { type: 'string', example: 'Hot tea' },
          },
        },
        CustomerRequest: {
          type: 'object',
          required: ['name', 'phone'],
          properties: {
            name: { type: 'string', example: 'Jayesh Hadiyal' },
            email: { type: 'string', nullable: true, example: 'jayesh@example.com' },
            phone: { type: 'string', example: '9876543210' },
          },
        },
        OrderItemRequest: {
          type: 'object',
          required: ['product_id', 'quantity'],
          properties: {
            product_id: { type: 'integer', example: 1 },
            quantity: { type: 'integer', example: 2 },
          },
        },
        OrderRequest: {
          type: 'object',
          required: ['items'],
          properties: {
            customer_id: { type: 'integer', nullable: true, example: 1 },
            table_id: { type: 'integer', nullable: true, example: 3 },
            coupon_code: { type: 'string', nullable: true, example: 'SUMMER20' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItemRequest' },
            },
          },
        },
        PayOrderRequest: {
          type: 'object',
          required: ['payment_method_id'],
          properties: {
            payment_method_id: { type: 'integer', example: 1 },
          },
        },
        KdsStatusRequest: {
          type: 'object',
          required: ['kds_status'],
          properties: {
            kds_status: {
              type: 'string',
              enum: ['to_cook', 'preparing', 'completed'],
              example: 'preparing',
            },
          },
        },
        PromotionRequest: {
          type: 'object',
          required: ['name', 'type', 'discount_type', 'discount_value'],
          properties: {
            name: { type: 'string', example: 'Summer 20' },
            type: {
              type: 'string',
              enum: ['coupon', 'product_promo', 'order_promo'],
              example: 'coupon',
            },
            coupon_code: { type: 'string', nullable: true, example: 'SUMMER20' },
            discount_type: {
              type: 'string',
              enum: ['percentage', 'fixed'],
              example: 'percentage',
            },
            discount_value: { type: 'number', example: 20 },
            min_qty: { type: 'integer', nullable: true, example: 5 },
            min_order_amount: { type: 'number', nullable: true, example: 500 },
            is_active: { type: 'boolean', example: true },
          },
        },
        ValidateCouponRequest: {
          type: 'object',
          required: ['coupon_code', 'subtotal'],
          properties: {
            coupon_code: { type: 'string', example: 'SUMMER20' },
            subtotal: { type: 'number', example: 1000 },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Validation failed' },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Unauthorized' },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Forbidden' },
            },
          },
        },
        NotFound: {
          description: 'Not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Resource not found' },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Internal server error' },
            },
          },
        },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new employee user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessMessage' },
                },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            409: { $ref: '#/components/responses/BadRequest' },
            500: { $ref: '#/components/responses/ServerError' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and receive a JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  example: {
                    success: true,
                    token: 'JWT_TOKEN',
                    user: {
                      id: 1,
                      name: 'Admin User',
                      email: 'admin@cafepos.com',
                      role: 'admin',
                    },
                  },
                },
              },
            },
            400: { $ref: '#/components/responses/BadRequest' },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/ServerError' },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current authenticated JWT payload',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Current user payload',
              content: {
                'application/json': {
                  example: {
                    success: true,
                    user: { id: 1, email: 'admin@cafepos.com', role: 'admin' },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            500: { $ref: '#/components/responses/ServerError' },
          },
        },
      },
      '/api/categories': {
        get: {
          tags: ['Categories'],
          summary: 'List categories',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Categories list' }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } },
        },
        post: {
          tags: ['Categories'],
          summary: 'Create category',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryRequest' } } } },
          responses: { 201: { description: 'Created category' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 500: { $ref: '#/components/responses/ServerError' } },
        },
      },
      '/api/categories/{id}': {
        get: {
          tags: ['Categories'],
          summary: 'Get category by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Category details' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } },
        },
        put: {
          tags: ['Categories'],
          summary: 'Update category',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryRequest' } } } },
          responses: { 200: { description: 'Updated category' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } },
        },
        delete: {
          tags: ['Categories'],
          summary: 'Delete category if unused',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted category' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } },
        },
      },
      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'List products with pagination, search, and category filter',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', example: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', example: 20 } },
            { name: 'search', in: 'query', schema: { type: 'string', example: 'tea' } },
            { name: 'category_id', in: 'query', schema: { type: 'integer', example: 1 } },
          ],
          responses: { 200: { description: 'Products list' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } },
        },
        post: {
          tags: ['Products'],
          summary: 'Create product',
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductRequest' } } } },
          responses: { 201: { description: 'Created product' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 500: { $ref: '#/components/responses/ServerError' } },
        },
      },
      '/api/products/{id}': {
        get: { tags: ['Products'], summary: 'Get product by id', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Product details' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
        put: { tags: ['Products'], summary: 'Update product', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductRequest' } } } }, responses: { 200: { description: 'Updated product' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
        delete: { tags: ['Products'], summary: 'Archive product', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Archived product' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/customers': {
        get: { tags: ['Customers'], summary: 'List customers', security: [{ bearerAuth: [] }], parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }, { name: 'search', in: 'query', schema: { type: 'string', example: 'jay' } }], responses: { 200: { description: 'Customers list' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } } },
        post: { tags: ['Customers'], summary: 'Create customer', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CustomerRequest' } } } }, responses: { 201: { description: 'Created customer' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/customers/{id}': {
        get: { tags: ['Customers'], summary: 'Get customer by id', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Customer details' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
        put: { tags: ['Customers'], summary: 'Update customer', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CustomerRequest' } } } }, responses: { 200: { description: 'Updated customer' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
        delete: { tags: ['Customers'], summary: 'Delete customer if not linked to orders', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted customer' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/orders': {
        get: { tags: ['Orders'], summary: 'List orders', security: [{ bearerAuth: [] }], parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }, { name: 'search', in: 'query', schema: { type: 'string' } }, { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'paid'] } }], responses: { 200: { description: 'Orders list' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } } },
        post: { tags: ['Orders'], summary: 'Create draft order', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderRequest' } } } }, responses: { 201: { description: 'Created draft order' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/orders/{id}': {
        get: { tags: ['Orders'], summary: 'Get order details', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Order details' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
        put: { tags: ['Orders'], summary: 'Update draft order', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderRequest' } } } }, responses: { 200: { description: 'Updated draft order' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
        delete: { tags: ['Orders'], summary: 'Delete draft order', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted draft order' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/orders/{id}/send-to-kitchen': {
        post: { tags: ['Orders'], summary: 'Send draft order to kitchen', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Order sent to kitchen' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/orders/{id}/pay': {
        post: { tags: ['Orders'], summary: 'Pay order', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PayOrderRequest' } } } }, responses: { 200: { description: 'Paid order' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/kds': {
        get: { tags: ['KDS'], summary: 'List active kitchen orders', security: [{ bearerAuth: [] }], parameters: [{ name: 'kds_status', in: 'query', schema: { type: 'string', enum: ['to_cook', 'preparing', 'completed'] } }, { name: 'q', in: 'query', schema: { type: 'string', example: 'tea' } }], responses: { 200: { description: 'Kitchen orders' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/kds/stats': {
        get: { tags: ['KDS'], summary: 'Get KDS counts', security: [{ bearerAuth: [] }], responses: { 200: { description: 'KDS stats' }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/kds/{id}': {
        get: { tags: ['KDS'], summary: 'Get kitchen order by id', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Kitchen order details' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/kds/{id}/status': {
        put: { tags: ['KDS'], summary: 'Update kitchen order status', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/KdsStatusRequest' } } } }, responses: { 200: { description: 'Updated KDS status' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/promotions': {
        get: { tags: ['Promotions'], summary: 'List promotions', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Promotions list' }, 401: { $ref: '#/components/responses/Unauthorized' }, 500: { $ref: '#/components/responses/ServerError' } } },
        post: { tags: ['Promotions'], summary: 'Create promotion', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PromotionRequest' } } } }, responses: { 201: { description: 'Created promotion' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/promotions/validate': {
        post: { tags: ['Promotions'], summary: 'Validate coupon code', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidateCouponRequest' } } } }, responses: { 200: { description: 'Coupon discount calculation', content: { 'application/json': { example: { success: true, data: { discount: 200, final_total: 800 } } } } }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/promotions/{id}': {
        get: { tags: ['Promotions'], summary: 'Get promotion by id', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Promotion details' }, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
        put: { tags: ['Promotions'], summary: 'Update promotion', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PromotionRequest' } } } }, responses: { 200: { description: 'Updated promotion' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
        delete: { tags: ['Promotions'], summary: 'Delete promotion', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted promotion' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 404: { $ref: '#/components/responses/NotFound' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/reports/summary': {
        get: { tags: ['Reports'], summary: 'Get report summary', security: [{ bearerAuth: [] }], parameters: [{ name: 'startDate', in: 'query', schema: { type: 'string', example: '2026-01-01' } }, { name: 'endDate', in: 'query', schema: { type: 'string', example: '2026-12-31' } }], responses: { 200: { description: 'Summary report' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/reports/sales-trend': {
        get: { tags: ['Reports'], summary: 'Get daily sales trend', security: [{ bearerAuth: [] }], parameters: [{ name: 'startDate', in: 'query', schema: { type: 'string' } }, { name: 'endDate', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'Sales trend' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/reports/top-products': {
        get: { tags: ['Reports'], summary: 'Get top products by revenue', security: [{ bearerAuth: [] }], parameters: [{ name: 'startDate', in: 'query', schema: { type: 'string' } }, { name: 'endDate', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'Top products' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/reports/top-categories': {
        get: { tags: ['Reports'], summary: 'Get top categories by revenue', security: [{ bearerAuth: [] }], parameters: [{ name: 'startDate', in: 'query', schema: { type: 'string' } }, { name: 'endDate', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'Top categories' }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
      '/api/reports/export': {
        get: { tags: ['Reports'], summary: 'Export paid orders report as CSV', security: [{ bearerAuth: [] }], parameters: [{ name: 'format', in: 'query', required: true, schema: { type: 'string', enum: ['csv'], example: 'csv' } }, { name: 'startDate', in: 'query', schema: { type: 'string' } }, { name: 'endDate', in: 'query', schema: { type: 'string' } }], responses: { 200: { description: 'CSV file download', content: { 'text/csv': { schema: { type: 'string' } } } }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' }, 500: { $ref: '#/components/responses/ServerError' } } },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJSDoc(swaggerOptions);
