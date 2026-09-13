import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { AuthContext } from "../Context/AuthContext";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const {
    cart,
    totalItems,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-w-screen h-15 grid grid-cols-3 items-center text-2xl fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black text-white" : "bg-transparent text-black"
      }`}
    >
      <div
        onClick={() => {
          navigate("/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="cursor-pointer font-semibold ml-10"
      >
        Stone._.Craft
      </div>
      <div className="">
        <ul className="flex justify-center tracking-wide gap-10">
          <li
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document
                  .getElementById("shop")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="cursor-pointer border-b-2 border-transparent hover:border-current transition-colors duration-200"
          >
            Shop
          </li>
          <li className="cursor-pointer border-b-2 border-transparent hover:border-current transition-colors duration-200">
            About Us
          </li>
          <li
            onClick={() => navigate("/contact")}
            className="cursor-pointer border-b-2 border-transparent hover:border-current transition-colors duration-200"
          >
            Contact
          </li>
          <li
            onClick={() => navigate("/account")}
            className="cursor-pointer border-b-2 border-transparent hover:border-current transition-colors duration-200"
          >
            {user ? "Account" : "Log In"}
          </li>
        </ul>
      </div>

      {/* Cart Icon & Hover Preview */}
      <div
        className="relative justify-self-end mr-10 mt-1 flex items-center gap-6"
        onMouseEnter={() => !isCartOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isCartOpen && (
          <div
            onClick={() => {
              setIsHovered(false);
              setIsCartOpen(true);
            }}
            className="cursor-pointer text-4xl relative hover:opacity-70 transition-opacity"
          >
            <i className="bx bx-cart" aria-label="Cart" />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
        )}

        {isHovered && !isCartOpen && (
          <div
            className="absolute right-0 top-full pt-3 w-80 z-50 text-base"
            style={{ color: "#2A2118" }}
          >
            <div
              className="p-5 rounded-2xl shadow-2xl flex flex-col gap-4 border"
              style={{
                backgroundColor: "#F7F1E6",
                borderColor: "rgba(35,75,59,0.15)",
              }}
            >
              <div
                className="flex items-center justify-between pb-3 border-b"
                style={{ borderColor: "rgba(35,75,59,0.1)" }}
              >
                <span
                  className="font-extrabold text-sm uppercase tracking-wider"
                  style={{ color: "#234B3B" }}
                >
                  Cart Preview ({totalItems})
                </span>
                <span
                  className="text-xs font-semibold cursor-pointer underline"
                  style={{ color: "#C1442C" }}
                  onClick={() => {
                    setIsHovered(false);
                    setIsCartOpen(true);
                  }}
                >
                  View All
                </span>
              </div>

              <div className="flex flex-col max-h-60 overflow-y-auto gap-3">
                {cart.length === 0 ? (
                  <p
                    className="text-sm py-4 text-center"
                    style={{ color: "#234B3B", opacity: 0.6 }}
                  >
                    Your cart is empty.
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#EFE6D8] flex items-center justify-center shrink-0">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="object-contain max-h-[80%] max-w-[80%]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5
                          className="font-bold text-sm truncate"
                          style={{ color: "#234B3B" }}
                        >
                          {item.name}
                        </h5>
                        <p
                          className="text-xs font-medium"
                          style={{ color: "#C1442C" }}
                        >
                          ₹{item.price} × {item.qty}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        className="text-xs font-bold px-2 py-1 text-red-600 hover:opacity-75 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div
                  className="pt-3 border-t flex flex-col gap-3"
                  style={{ borderColor: "rgba(35,75,59,0.1)" }}
                >
                  <div
                    className="flex justify-between items-center font-bold text-sm"
                    style={{ color: "#234B3B" }}
                  >
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsHovered(false);
                      setIsCartOpen(true);
                    }}
                    className="w-full py-2.5 rounded-full text-xs font-bold tracking-wide shadow-sm transition-all hover:opacity-95 cursor-pointer"
                    style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
                  >
                    Open Full Cart & Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
