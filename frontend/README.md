# Frontend

Mobile sneaker store for Kick Street App built with Expo SDK 54 and React Native.

## Features

- **User Authentication**:
  - Registration with name, email, phone, and password
  - Login with JWT token persistence
  - Protected profile access and updates
- **Sneaker Catalog**:
  - Featured products on home screen
  - Browse all products by category (Men, Women, Children, Unisex)
  - Search functionality for finding specific sneakers
  - Product details with image gallery and descriptions
- **Shopping Cart**:
  - Add products with size selection
  - Quantity editing
  - Real-time total calculation
  - Cart item removal
- **Checkout**:
  - Cash-on-delivery payment method
  - Stock validation before order placement
- **Order History**:
  - View past orders with status tracking
  - Order details and delivery status

## Folder Structure

```text
frontend/
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash.png
├── components/
│   ├── AppButton.js
│   ├── AppInput.js
│   ├── EmptyState.js
│   ├── ProductCard.js
│   └── Screen.js
├── navigation/
│   └── AppNavigator.js
├── screens/
│   ├── HomeScreen.js
│   ├── ShopScreen.js
│   ├── ProductDetailsScreen.js
│   ├── CartScreen.js
│   ├── CheckoutScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ProfileScreen.js
│   └── OrdersScreen.js
├── services/
│   └── api.js
├── store/
│   ├── AuthContext.js
│   └── CartContext.js
├── utils/
│   ├── format.js
│   └── theme.js
├── App.js
├── app.json
└── package.json
```

## Setup

```bash
cd frontend
npm install
npx expo start
```

The mobile app runs on Expo Go. For Android Emulator, configure the API base URL in `services/api.js` to `http://10.0.2.2:5000/api`.