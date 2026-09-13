import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "./data/products";
import { CartContext } from "../Context/CartContext";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCheckoutOpen } = useContext(CartContext);
  const product = products.find((p) => p.id === Number(id));
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ backgroundColor: "#F7F1E6" }}
      >
        <p
          className="text-2xl font-normal tracking-wide"
          style={{ color: "#234B3B" }}
        >
          Product not found.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-full font-medium text-sm transition-all hover:opacity-90 cursor-pointer active:scale-[0.98]"
          style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
        >
          Back to shop
        </button>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, qty);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      className="min-h-screen pt-32 pb-32 px-8 md:px-24 relative"
      style={{ backgroundColor: "#F7F1E6" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:opacity-90 active:scale-95 cursor-pointer"
          style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
        >
          <svg
            style={{ width: "18px", height: "18px", display: "inline-block" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            ></path>
          </svg>
          <span>Back to Shop</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-28 items-start">
        {/* Left Image View */}
        <div className="flex flex-col gap-6">
          <div
            onClick={() => setIsZoomed(true)}
            className="relative flex items-center justify-center overflow-hidden shadow-sm group cursor-pointer"
            style={{
              backgroundColor: "#EFE6D8",
              borderRadius: "28px",
              aspectRatio: "1 / 1",
            }}
          >
            <span
              className="text-sm font-bold shadow-sm"
              style={{
                position: "absolute",
                top: "28px",
                left: "28px",
                backgroundColor: "#C1442C",
                color: "#F7F1E6",
                borderRadius: "6px",
                padding: "8px 16px",
                transform: "rotate(-3deg)",
                zIndex: 10,
              }}
            >
              ₹{product.price}
            </span>

            <img
              src={product.img}
              alt={product.name}
              className="object-contain max-h-[75%] max-w-[75%] transition-transform duration-500 ease-out group-hover:scale-105"
              style={{ filter: "drop-shadow(0 25px 30px rgba(35,75,59,0.15))" }}
            />

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              style={{ backgroundColor: "rgba(35, 75, 59, 0.08)" }}
            >
              <span
                className="px-4 py-2 rounded-full text-xs font-semibold shadow-md"
                style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
              >
                Click to expand
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="flex items-center gap-3 text-sm font-medium p-4 bg-white rounded-2xl"
              style={{
                border: "1px solid rgba(35,75,59,0.1)",
                color: "#234B3B",
              }}
            >
              <i className="bx bx-cube text-xl" style={{ color: "#C1442C" }} />
              <span>Plaster figurine</span>
            </div>
            <div
              className="flex items-center gap-3 text-sm font-medium p-4 bg-white rounded-2xl"
              style={{
                border: "1px solid rgba(35,75,59,0.1)",
                color: "#234B3B",
              }}
            >
              <i className="bx bx-paint text-xl" style={{ color: "#C1442C" }} />
              <span>Brush + 4 paints</span>
            </div>
          </div>

          <div
            className="text-sm px-1 pt-2"
            style={{ color: "#2A2118", opacity: 0.8 }}
          >
            Planning an event or bulk purchase? For wholesale{" "}
            <span
              onClick={() => navigate("/contact")}
              className="font-semibold underline cursor-pointer hover:opacity-75"
              style={{ color: "#234B3B" }}
            >
              contact us
            </span>
            .
          </div>
        </div>

        {/* Right Details View */}
        <div className="flex flex-col pt-2">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5"
            style={{ color: "#234B3B", lineHeight: 1.15 }}
          >
            {product.name}
          </h1>

          <p
            className="text-base md:text-lg font-light mb-9"
            style={{ color: "#2A2118", opacity: 0.8, lineHeight: 1.8 }}
          >
            {product.subtitle}. Delivered completely unpainted and ready to
            customize — every kit includes a fine-tip paintbrush and four
            vibrant paint pots.
          </p>

          <div
            className="flex items-center justify-between p-6 rounded-2xl mb-10 shadow-sm"
            style={{
              backgroundColor: "rgba(239, 230, 216, 0.5)",
              border: "1px solid rgba(35,75,59,0.08)",
            }}
          >
            <div className="flex flex-col">
              <span
                className="text-xs uppercase tracking-widest font-semibold mb-1"
                style={{ color: "#234B3B", opacity: 0.5 }}
              >
                Total Price
              </span>
              <span
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{ color: "#234B3B" }}
              >
                ₹{product.price * qty}
              </span>
            </div>

            <div
              className="inline-flex items-center bg-white shadow-sm"
              style={{
                border: "1px solid rgba(35,75,59,0.15)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center font-bold text-lg hover:bg-stone-50 cursor-pointer"
                style={{ color: "#234B3B" }}
              >
                −
              </button>
              <span
                className="w-10 text-center font-semibold text-base"
                style={{ color: "#234B3B" }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-12 h-12 flex items-center justify-center font-bold text-lg hover:bg-stone-50 cursor-pointer"
                style={{ color: "#234B3B" }}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full py-4 rounded-full font-semibold text-base shadow-md transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer mb-10"
            style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
          >
            Buy Now
          </button>

          <div
            style={{
              borderTop: "1px solid rgba(35,75,59,0.1)",
              paddingTop: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
            className="text-sm font-medium"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <i className="bx bx-paint text-xl" style={{ color: "#C1442C" }} />
              <span style={{ color: "#2A2118" }}>
                Brush and 4 paint pots included with every kit
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <i
                className="bx bx-package text-xl"
                style={{ color: "#C1442C" }}
              />
              <span style={{ color: "#2A2118" }}>
                Securely packaged to prevent transit damage
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <i className="bx bx-child text-xl" style={{ color: "#C1442C" }} />
              <span style={{ color: "#2A2118" }}>
                Engaging, screen-free creative activity for all ages
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
