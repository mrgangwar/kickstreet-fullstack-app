import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (product, size) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.productId === product._id && item.size === size
      );

      if (existing) {
        return current.map((item) =>
          item.productId === product._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          size,
          image: product.images?.[0] || '',
          quantity: 1
        }
      ];
    });
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) {
      removeItem(productId, size);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (productId, size) => {
    setItems((current) =>
      current.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const value = useMemo(
    () => ({
      items,
      total,
      count,
      addItem,
      updateQuantity,
      removeItem,
      clearCart
    }),
    [items, total, count]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);