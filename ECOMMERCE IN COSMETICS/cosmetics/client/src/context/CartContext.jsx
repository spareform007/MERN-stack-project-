import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('maeCart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          // Filter out corrupted cart items where product is null
          setCartItems(parsed.filter((item) => item && item.product && item.product.price));
        }
      } catch (e) {
        localStorage.removeItem('maeCart');
      }
    }
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('maeCart', JSON.stringify(items));
  };

  const addToCart = (product, selectedShade = null, qty = 1) => {
    if (!product || !product._id) return;

    const shadeKey = selectedShade ? selectedShade.shadeName : 'default';
    const existingIndex = cartItems.findIndex(
      (item) => item.product?._id === product._id && item.shadeKey === shadeKey
    );

    let updated = [...cartItems];
    if (existingIndex > -1) {
      updated[existingIndex].qty += qty;
    } else {
      updated.push({
        product,
        selectedShade: selectedShade || product.shades?.[0] || null,
        shadeKey,
        qty: Math.max(1, qty)
      });
    }

    saveCart(updated);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const updateQty = (index, qty) => {
    if (qty <= 0) {
      removeFromCart(index);
      return;
    }
    const updated = [...cartItems];
    if (updated[index]) {
      updated[index].qty = qty;
      saveCart(updated);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + ((item.product?.price || 0) * (item.qty || 1)),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        subtotal,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
