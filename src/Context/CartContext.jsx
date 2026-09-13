import { useState, createContext } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // 1. Add checkout modal state

  const addToCart = (product, qty = 1) => {
    const quantityToAdd = Number(qty) || 1;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id,
      );

      if (existingIndex > -1) {
        return prevCart.map((item, index) => {
          if (index === existingIndex) {
            return { ...item, qty: Number(item.qty) + quantityToAdd };
          }
          return item;
        });
      }

      return [...prevCart, { ...product, qty: quantityToAdd }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Number(item.qty) + Number(delta);
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + Number(item.qty), 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen, // 2. Export isCheckoutOpen
        setIsCheckoutOpen, // 3. Export setIsCheckoutOpen
        clearCart, // 4. Export clearCart
        addToCart,
        removeFromCart,
        updateQty,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
