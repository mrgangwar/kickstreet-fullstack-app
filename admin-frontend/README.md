# Admin Frontend

Admin dashboard for Kick Street App built with React, Vite, and Tailwind CSS.

## Features

- **Authentication**: Secure admin login with JWT-based authentication
- **Dashboard**: Overview statistics including total products, orders, revenue, and pending/delivered order counts
- **Revenue Analytics**: Interactive bar chart visualization of monthly revenue trends
- **Product Management**: 
  - View all products in a tabular format
  - Add new products with name, price, category, sizes, stock, and images
  - Edit existing product details
  - Delete products from inventory
- **Order Management**:
  - View all customer orders
  - Update order status (Processing, Shipped, Delivered)
- **Protected Routes**: Route-level authentication guard for admin-only access

## Folder Structure

```text
admin-frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── ProtectedRoute.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── AddProduct.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EditProduct.jsx
│   │   ├── Login.jsx
│   │   ├── Orders.jsx
│   │   └── Products.jsx
│   ├── services/
│   │   └── api.js
│   └── styles/
│       ├── dashboard.css
│       ├── login.css
│       ├── sidebar.css
│       └── table.css
├── index.html
├── vite.config.js
└── package.json
```

## Setup

```bash
cd admin-frontend
npm install
npm run dev
```

The admin panel runs on `http://localhost:5173` by default.