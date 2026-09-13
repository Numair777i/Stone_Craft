import { createContext, useState, useCallback } from "react";

export const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const addToWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist],
  );

  const syncWishlistToServer = useCallback(
    async (userId, token) => {
      if (!userId || !wishlist.length) return;

      try {
        for (const item of wishlist) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              userId,
              productId: item.id,
              name: item.name,
              price: item.price,
              img: item.img,
            }),
          });
        }
      } catch (err) {
        console.error("Failed to sync wishlist:", err);
      }
    },
    [wishlist],
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        syncWishlistToServer,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
