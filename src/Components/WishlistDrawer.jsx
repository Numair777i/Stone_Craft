import { useContext } from "react";
import { WishlistContext } from "../Context/WishlistContext";
import { CartContext } from "../Context/CartContext";

export default function WishlistDrawer() {
  const { wishlist, removeFromWishlist, isWishlistOpen, setIsWishlistOpen } =
    useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (!isWishlistOpen) return null;

  return (
    <div
      onClick={() => setIsWishlistOpen(false)}
      className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#F7F4EC] rounded-3xl p-8 shadow-2xl h-[90vh] flex flex-col text-[#1A2E24] cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2D5240]/10">
          <h2 className="text-xl font-extrabold tracking-tight">
            Saved Items ({wishlist.length})
          </h2>
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-200/60 hover:bg-neutral-300 text-neutral-600 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-6">
          {wishlist.length === 0 ? (
            <div className="text-center py-12 text-[#2D5240]/60">
              <p className="text-sm mb-3">No saved items yet</p>
              <p className="text-xs text-[#2D5240]/40">
                Heart your favorite products to save them here
              </p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white border border-[#2D5240]/15 rounded-2xl hover:border-[#2D5240]/30 transition"
              >
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[#1A2E24] mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-[#C24B38] mb-3">
                    ₹{item.price}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 px-2 py-1.5 bg-[#2D5240] text-white text-xs font-semibold rounded-lg hover:bg-[#1A2E24] transition cursor-pointer"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="px-3 py-1.5 border border-[#2D5240]/20 text-[#2D5240] text-xs font-semibold rounded-lg hover:bg-red-50 transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsWishlistOpen(false)}
          className="w-full py-3 border border-[#2D5240]/20 rounded-full font-semibold text-sm hover:bg-black/5 transition cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
