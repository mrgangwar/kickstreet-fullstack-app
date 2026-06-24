# Backend

Express MVC backend for Kick Street App built with Node.js 20, MongoDB, and Mongoose.

## Features

- **Authentication**:
  - JWT-based registration and login
  - Password hashing with bcrypt
  - Protected routes with middleware
  - Token persistence and validation
- **Product Management**:
  - CRUD operations for products
  - Category filtering (Men, Women, Children, Unisex)
  - Featured product flag
  - Stock management
- **Order Management**:
  - Customer order placement
  - Cash-on-delivery checkout
  - Order status tracking (Processing, Shipped, Delivered)
  - Stock validation on order creation
- **Admin Dashboard**:
  - Statistics endpoint (total products, orders, revenue)
  - Revenue analytics with monthly breakdown
  - Admin-only product CRUD operations
  - Admin-only order status updates
- **Security & Performance**:
  - Centralized error handling
  - Async handler wrapper
  - Rate limiting
  - Input validation
  - Secure middleware for protected/admin routes

## Folder Structure

```text
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── orderController.js
│   └── productController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
├── services/
│   ├── orderService.js
│   └── tokenService.js
├── utils/
│   ├── apiError.js
│   ├── asyncHandler.js
│   ├── createAdmin.js
│   ├── createTestUser.js
│   ├── seed.js
│   └── slugify.js
├── server.js
└── package.json
```

## Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/kick_street_app
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:8081
```

### Seed Data

```bash
npm run seed
```

Default admin credentials:
- Email: `admin@kickstreet.app`
- Password: `Admin@12345`

### API Routes

#### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

#### Products
- `GET /api/products` - Get all products (optional filters: category, featured, search)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

#### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - Get user orders (protected)
- `GET /api/orders/admin` - Get all orders (admin)
- `PATCH /api/orders/:id/status` - Update order status (admin)

#### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (admin)
- `GET /api/admin/analytics` - Get revenue analytics (admin)