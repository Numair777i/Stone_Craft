import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../Context/WishlistContext";

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const goToProduct = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={goToProduct}
      className="relative flex flex-col items-center px-6 pb-6 transition-transform duration-300"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "30px",
        borderTop: "4px solid #234B3B",
        border: "1px solid rgba(35,75,59,0.14)",
        borderTopWidth: "4px",
        borderTopColor: "#234B3B",
        boxShadow: hovered
          ? "0 18px 32px rgba(35,75,59,0.18)"
          : "0 8px 18px rgba(35,75,59,0.10)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
      }}
    >
      {/* Price tag */}
      <span
        className="absolute top-5 right-5 text-sm font-bold px-2.5 py-1.5 z-10"
        style={{
          backgroundColor: "#C1442C",
          color: "#F7F1E6",
          borderRadius: "4px",
          transform: "rotate(4deg)",
        }}
      >
        ₹{product.price}
      </span>

      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 z-20 hover:scale-110"
        style={{
          backgroundColor: isInWishlist(product.id) ? "#C1442C" : "rgba(0,0,0,0.05)",
          color: isInWishlist(product.id) ? "#fff" : "#234B3B",
        }}
        title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist(product.id) ? "♥" : "♡"}
      </button>

      <img
        src={product.img}
        alt={product.name}
        className="w-full h-56 object-contain mt-6 transition-transform duration-300 z-0"
        style={{
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      />

      <div className="mt-4 flex flex-col items-center gap-1 text-center">
        <span
          className="text-lg font-bold"
          style={{ color: "#234B3B", opacity: 0.9 }}
        >
          {product.name}
        </span>
        <span className="text-sm" style={{ color: "#2A2118", opacity: 0.6 }}>
          {product.subtitle}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          goToProduct();
        }}
        className="mt-5 w-full py-2.5 font-semibold text-sm transition-colors duration-200 cursor-pointer"
        style={{
          backgroundColor: "#234B3B",
          color: "#F7F1E6",
          borderRadius: "6px",
          border: "none",
          opacity: "0.9",
        }}
      >
        Buy Now
      </button>
    </div>
  );
}

export default ProductCard;
