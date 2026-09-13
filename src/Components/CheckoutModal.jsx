import { useState, useEffect, useContext } from "react";
import { CartContext } from "../Context/CartContext";
import { AuthContext } from "../Context/AuthContext";

export default function CheckoutModal() {
  const { cart, isCheckoutOpen, setIsCheckoutOpen, clearCart, subtotal } =
    useContext(CartContext);
  const { user, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "razorpay",
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState("");

  // Keep form in sync when user logs in / out
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user?.name || "",
      email: user?.email || "",
    }));
  }, [user]);

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setOrderSuccess(false);
    setError("");
    setIsCheckoutOpen(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const activeUserId = user?._id || user?.id;
    if (!activeUserId) {
      setError("Please sign in or create an account to place an order.");
      return;
    }

    setLoading(true);

    const orderId = "SC-" + Date.now();
    const orderPayload = {
      userId: activeUserId,
      orderId,
      total: subtotal,
      items: cart,
      paymentMethod: formData.paymentMethod,
      shipping: {
        fullName: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      },
    };

    try {
      // Create order in database
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        throw new Error(data.error || "Failed to create order.");
      }

      // Initiate payment based on selected method
      if (formData.paymentMethod === "razorpay") {
        await initiateRazorpayPayment(orderId, subtotal);
      } else if (formData.paymentMethod === "stripe") {
        await initiateStripePayment(orderId, subtotal);
      }

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = async (orderId, amount) => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);

    script.onload = async () => {
      try {
        const payRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/payments/razorpay/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, amount }),
          },
        );

        const paymentData = await payRes.json();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: paymentData.amount,
          currency: "INR",
          order_id: paymentData.id,
          handler: async (response) => {
            // Verify payment
            await fetch(`${import.meta.env.VITE_API_URL}/api/payments/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                razorpay_order_id: paymentData.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
          },
          prefill: {
            name: formData.name,
            email: formData.email,
          },
          theme: {
            color: "#2D5240",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (err) {
        setError("Failed to initiate Razorpay payment: " + err.message);
      }
    };
  };

  const initiateStripePayment = async (orderId, amount) => {
    try {
      const payRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/stripe/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, amount }),
        },
      );

      const paymentIntent = await payRes.json();

      // Redirect to Stripe checkout or use Stripe.js
      // For now, confirm payment client-side
      await fetch(`${import.meta.env.VITE_API_URL}/api/payments/stripe/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentIntentId: paymentIntent.id,
        }),
      });
    } catch (err) {
      setError("Failed to initiate Stripe payment: " + err.message);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#F7F4EC] rounded-3xl p-8 shadow-2xl relative text-[#1A2E24] cursor-default"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-neutral-200/60 hover:bg-neutral-300 text-neutral-600 transition cursor-pointer"
        >
          ✕
        </button>

        {orderSuccess ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center text-3xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-extrabold text-[#1A2E24]">
              Order Confirmed!
            </h3>
            <p className="text-sm text-[#2D5240]/70 max-w-xs mx-auto">
              Thank you for supporting craft art. Your kit is being prepared.
            </p>
            <div className="bg-[#F7F4EC] border border-[#2D5240]/15 rounded-2xl p-4 my-6 text-left">
              <p className="text-xs text-[#2D5240]/80 mb-2">
                <strong>✉️ Confirmation email sent to:</strong>
              </p>
              <p className="text-sm font-semibold text-[#1A2E24] break-all">
                {formData.email}
              </p>
              <p className="text-xs text-[#2D5240]/60 mt-2">
                Check your inbox for order details and payment confirmation.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 px-8 py-3 bg-[#2D5240] text-white text-sm font-semibold rounded-full hover:bg-[#1A2E24] transition cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-4">
              Checkout Details
            </h2>

            {user && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <span>
                  ✓ Auto-filled using your saved account details ({user.name})
                </span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3.5 bg-red-100 border border-red-300 text-red-700 text-xs rounded-xl leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5240]/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Numair"
                  className="w-full px-4 py-3 bg-white border border-[#2D5240]/20 rounded-xl text-sm focus:outline-none focus:border-[#2D5240] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5240]/70 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-white border border-[#2D5240]/20 rounded-xl text-sm focus:outline-none focus:border-[#2D5240] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5240]/70 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="House / Flat no, Street name"
                  className="w-full px-4 py-3 bg-white border border-[#2D5240]/20 rounded-xl text-sm focus:outline-none focus:border-[#2D5240] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5240]/70 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="New Delhi"
                    className="w-full px-4 py-3 bg-white border border-[#2D5240]/20 rounded-xl text-sm focus:outline-none focus:border-[#2D5240] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5240]/70 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="110025"
                    className="w-full px-4 py-3 bg-white border border-[#2D5240]/20 rounded-xl text-sm focus:outline-none focus:border-[#2D5240] transition"
                  />
                </div>
              </div>

              <div className="border-t border-[#2D5240]/10 pt-4 mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2D5240]/70 mb-3">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="razorpay"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === "razorpay"}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="razorpay" className="text-sm text-[#2D5240] cursor-pointer">
                      Razorpay (Cards, UPI, Wallets)
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="stripe"
                      name="paymentMethod"
                      value="stripe"
                      checked={formData.paymentMethod === "stripe"}
                      onChange={handleChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="stripe" className="text-sm text-[#2D5240] cursor-pointer">
                      Stripe (International Cards)
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#2D5240]/10 pt-4 mt-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#2D5240]/70">
                  Subtotal
                </span>
                <span className="text-2xl font-black text-[#1A2E24]">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3.5 border border-[#2D5240]/20 rounded-full font-semibold text-sm hover:bg-black/5 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-[#2D5240] text-white rounded-full font-semibold text-sm hover:bg-[#1A2E24] transition disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
