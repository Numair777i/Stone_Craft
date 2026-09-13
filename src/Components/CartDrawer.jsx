import { useContext } from "react";
import { CartContext } from "../Context/CartContext";

function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeFromCart,
    updateQty,
    subtotal,
  } = useContext(CartContext);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex justify-end transition-opacity"
      style={{
        backgroundColor: "rgba(35, 75, 59, 0.4)",
        backdropFilter: "blur(6px)",
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="w-full max-w-md h-full flex flex-col shadow-2xl p-6 md:p-8 pt-10 relative"
        style={{ backgroundColor: "#F7F1E6" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with 100% clickable close button */}
        <div
          className="flex items-center justify-between pb-6 border-b"
          style={{ borderColor: "rgba(35,75,59,0.12)" }}
        >
          <h2
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: "#234B3B" }}
          >
            Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors hover:bg-stone-200 cursor-pointer shrink-0"
            style={{ color: "#234B3B", backgroundColor: "rgba(35,75,59,0.08)" }}
            aria-label="Close Cart"
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <i
                className="bx bx-shopping-bag text-5xl"
                style={{ color: "#234B3B", opacity: 0.3 }}
              />
              <p
                className="text-base font-medium"
                style={{ color: "#234B3B", opacity: 0.7 }}
              >
                Your cart is currently empty.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm"
                style={{ border: "1px solid rgba(35,75,59,0.08)" }}
              >
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EFE6D8" }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="object-contain max-h-[75%] max-w-[75%]"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <h4
                    className="font-bold text-base"
                    style={{ color: "#234B3B" }}
                  >
                    {item.name}
                  </h4>
                  <span
                    className="text-sm font-semibold mb-2"
                    style={{ color: "#C1442C" }}
                  >
                    ₹{item.price}
                  </span>

                  <div className="flex items-center justify-between">
                    <div
                      className="inline-flex items-center"
                      style={{
                        border: "1px solid rgba(35,75,59,0.2)",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center font-bold cursor-pointer hover:bg-stone-100"
                        style={{ color: "#234B3B" }}
                      >
                        −
                      </button>
                      <span
                        className="w-6 text-center text-sm font-semibold"
                        style={{ color: "#234B3B" }}
                      >
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold cursor-pointer hover:bg-stone-100"
                        style={{ color: "#234B3B" }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs font-semibold underline cursor-pointer hover:opacity-75"
                      style={{ color: "#C1442C" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cart.length > 0 && (
          <div
            className="pt-6 border-t"
            style={{ borderColor: "rgba(35,75,59,0.12)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm font-semibold"
                style={{ color: "#234B3B", opacity: 0.7 }}
              >
                Subtotal
              </span>
              <span
                className="text-2xl font-extrabold"
                style={{ color: "#234B3B" }}
              >
                ₹{subtotal}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3.5 bg-[#2D5240] text-white rounded-full font-semibold text-sm hover:bg-[#1A2E24] transition cursor-pointer" // keep your existing styling classes
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
