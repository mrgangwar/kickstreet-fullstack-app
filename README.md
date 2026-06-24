# Kick Street App

Kick Street App is a production-ready mobile sneaker store built with Expo SDK 54, React Native, Node.js 20, Express, MongoDB, Mongoose, and JWT authentication.

## Folder Structure

```text
Kick-Street-App/
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   ├── store/
│   ├── utils/
│   ├── App.js
│   ├── app.json
│   └── package.json
├── admin-frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── README.md
```

## Features

### User (Frontend)
- **Authentication**: Registration, login with JWT token persistence, protected profile access
- **Sneaker Catalog**: Featured products, category filters, search, product details
- **Shopping Cart**: Add products with size selection, quantity editing, real-time total calculation
- **Checkout**: Cash-on-delivery payment with stock validation
- **Order History**: View past orders with status tracking

### Admin (Admin Frontend)
- **Dashboard**: Statistics overview (products, orders, revenue, pending/delivered orders)
- **Revenue Analytics**: Monthly revenue visualization with bar charts
- **Product Management**: Create, edit, delete products with full details
- **Order Management**: View all orders, update order status

### Backend
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Product API**: CRUD operations, category filtering, featured products
- **Order API**: Cash-on-delivery checkout, stock validation, status tracking
- **Admin API**: Dashboard statistics, revenue analytics, admin-only operations
- **Security**: Centralized error handling, protected/admin middleware, rate limiting

## Prerequisites

- Node.js v20+
- MongoDB local server or MongoDB Atlas
- Expo Go or an Android/iOS simulator

## Backend Setup

```bash
cd Kick-Street-App/backend
npm install
copy .env.example .env
npm run dev
```

Update `backend/.env` before running in production:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/kick_street_app
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:8081
```

Optional seed data:

```bash
npm run seed
```

Seed admin:

- Email: `admin@kickstreet.app`
- Password: `Admin@12345`

## Frontend Setup

```bash
cd Kick-Street-App/frontend
npm install
npx expo start
```

The mobile API client defaults to:

```text
http://localhost:5000/api
```

For Android Emulator, use `http://10.0.2.2:5000/api`. For a physical phone, use your computer LAN IP, for example `http://192.168.1.20:5000/api`, in `frontend/services/api.js`.

## Admin Frontend Setup

```bash
cd admin-frontend
npm install
npm run dev
```

The admin panel runs on `http://localhost:5173` by default.

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` admin
- `PUT /api/products/:id` admin
- `DELETE /api/products/:id` admin

### Orders

- `POST /api/orders`
- `GET /api/orders/my-orders`
- `GET /api/orders/admin` admin
- `PATCH /api/orders/:id/status` admin

### Admin

- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/analytics` - Get revenue analytics

## Run Commands

Frontend:

```bash
npx expo start
```

Backend:

```bash
npm run dev
```

## Production Notes

- Use a long random `JWT_SECRET`.
- Use MongoDB Atlas or a managed MongoDB instance for production.
- Restrict `CLIENT_ORIGIN` to trusted hosts.
- Replace image URL entry with a managed upload service before accepting public admin uploads.
- Add payment gateway routes if prepaid card/UPI checkout is required.
