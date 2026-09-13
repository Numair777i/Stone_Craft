import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import OrderTracking from "./OrderTracking";

export default function AccountPage() {
  const { user, loginUser, registerUser, logoutUser, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'profile'
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Track selected order

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch orders linked to this user
  useEffect(() => {
    if (!user) return;

    const activeUserId = user._id || user.id;
    console.log("Fetching orders for userId:", activeUserId); // DEBUG
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    setFetchingOrders(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/orders?userId=${activeUserId}`, {
      headers,
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        console.log("Orders fetched:", data); // DEBUG
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Orders fetch error:", err); // DEBUG
        setOrders([]);
      })
      .finally(() => setFetchingOrders(false));
  }, [user, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      } else {
        res = await registerUser(formData);
      }

      if (!res.success) {
        setError(
          res.error || "Authentication failed. Please check your credentials.",
        );
      } else {
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#2D5240] flex flex-col font-sans selection:bg-[#2D5240] selection:text-white">
      {/* Top Navbar */}
      <header className="w-full px-8 py-6 flex items-center justify-between border-b border-[#2D5240]/10">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-[#1A2E24] hover:opacity-85 transition"
        >
          Stone._.Craft
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#2D5240]">
          <Link to="/" className="hover:text-[#1A2E24] transition">
            Shop
          </Link>
          <a href="#about" className="hover:text-[#1A2E24] transition">
            About Us
          </a>
          <Link to="/contact" className="hover:text-[#1A2E24] transition">
            Contact
          </Link>
          <Link to="/account" className="font-semibold text-[#1A2E24]">
            Account
          </Link>
        </nav>
        <Link
          to="/"
          className="text-xs uppercase tracking-wider font-semibold px-4 py-2 border border-[#2D5240]/30 rounded-full hover:bg-[#2D5240] hover:text-white transition"
        >
          Back to Store
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10">
        {user ? (
          /* Dashboard When Logged In */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Profile Card */}
            <div className="bg-white border border-[#2D5240]/15 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-fit">
              <div>
                <div className="w-20 h-20 bg-[#2D5240]/10 text-[#2D5240] rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <h2 className="text-xl font-extrabold text-center text-[#1A2E24] tracking-tight">
                  {user.name || "Craft Member"}
                </h2>
                <p className="text-xs text-center text-[#2D5240]/70 mt-1">
                  {user.email}
                </p>

                <div className="mt-6 space-y-2 border-t border-[#2D5240]/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      activeTab === "orders"
                        ? "bg-[#2D5240] text-white"
                        : "text-[#2D5240] hover:bg-[#F0ECE1]"
                    }`}
                  >
                    My Orders ({orders.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      activeTab === "profile"
                        ? "bg-[#2D5240] text-white"
                        : "text-[#2D5240] hover:bg-[#F0ECE1]"
                    }`}
                  >
                    Account Settings
                  </button>
                </div>
              </div>

              <div className="mt-8 border-t border-[#2D5240]/10 pt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full py-2.5 bg-[#C24B38] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#A83E2D] transition cursor-pointer"
                >
                  Shop Stone Kits
                </button>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="w-full py-2.5 border border-[#2D5240]/20 text-[#2D5240] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-black/5 transition cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Content Tab Details */}
            <div className="md:col-span-2 space-y-6">
              {activeTab === "orders" && (
                <div className="bg-white border border-[#2D5240]/15 rounded-3xl p-6 shadow-sm">
                  {selectedOrderId ? (
                    /* Order Detail View */
                    <OrderTracking
                      orderId={selectedOrderId}
                      onBack={() => setSelectedOrderId(null)}
                    />
                  ) : (
                    /* Order List View */
                    <>
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2D5240]/10">
                        <h3 className="text-xl font-bold text-[#1A2E24]">
                          Order History
                        </h3>
                        <span className="text-xs text-[#2D5240]/60 font-semibold uppercase tracking-wider">
                          {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                        </span>
                      </div>

                      {fetchingOrders ? (
                        <div className="text-center py-12 text-[#2D5240]/50 text-sm">
                          Loading orders from database...
                        </div>
                      ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-sm text-[#2D5240]/70 mb-4">
                            You haven't placed any craft kit orders yet.
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-6 py-2.5 bg-[#2D5240] text-white text-xs font-semibold rounded-full hover:bg-[#1A2E24] transition cursor-pointer"
                          >
                            Explore Collection
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((ord) => (
                            <div
                              key={ord._id || ord.orderId}
                              onClick={() => setSelectedOrderId(ord.orderId)}
                              className="p-5 border border-[#2D5240]/15 rounded-2xl bg-[#FBF9F4]/60 space-y-3 cursor-pointer hover:border-[#2D5240]/40 hover:bg-[#FBF9F4] transition"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-bold text-[#1A2E24] text-sm">
                                    Order #
                                    {ord.orderId ||
                                      (ord._id ? ord._id.slice(-6) : "SC-Craft")}
                                  </p>
                                  <p className="text-xs text-[#2D5240]/60 mt-0.5">
                                    {ord.createdAt
                                      ? new Date(ord.createdAt).toLocaleDateString()
                                      : "Recent Order"}
                                  </p>
                                  <p className="text-xs text-[#2D5240]/50 mt-1">
                                    {ord.statusTimeline && ord.statusTimeline.length > 0
                                      ? `Updated: ${new Date(
                                          ord.statusTimeline[ord.statusTimeline.length - 1]
                                            .timestamp,
                                        ).toLocaleString()}`
                                      : ""}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-base font-extrabold text-[#1A2E24]">
                                    ₹{ord.total || ord.totalAmount || 0}
                                  </p>
                                  <span
                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                                      ord.status === "Delivered"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : ord.status === "Shipped"
                                        ? "bg-sky-100 text-sky-800"
                                        : ord.status === "Confirmed"
                                        ? "bg-blue-100 text-blue-800"
                                        : ord.status === "Processing"
                                        ? "bg-amber-100 text-amber-800"
                                        : ord.status === "Cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-slate-100 text-slate-800"
                                    }`}
                                  >
                                    {ord.status || "Confirmed"}
                                  </span>
                                </div>
                              </div>

                              {/* Items Breakdown if present in order document */}
                              {ord.items && ord.items.length > 0 && (
                                <div className="pt-2 border-t border-[#2D5240]/10 text-xs text-[#2D5240]/80">
                                  <span className="font-semibold block mb-1 text-[#1A2E24]">
                                    Items Ordered:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {ord.items.map((item, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-white px-2 py-1 rounded-md border border-[#2D5240]/10"
                                      >
                                        {item.name || "Stone Kit"} x{item.qty || 1}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-end pt-2 text-[#2D5240]/60 hover:text-[#2D5240] transition">
                                <span className="text-xs font-semibold">
                                  Click to view details →
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === "profile" && (
                <div className="bg-white border border-[#2D5240]/15 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-[#1A2E24] mb-6 pb-4 border-b border-[#2D5240]/10">
                    Account Information
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="block text-xs uppercase text-[#2D5240]/60 font-semibold mb-1">
                        Full Name
                      </span>
                      <p className="font-medium text-[#1A2E24] bg-[#FBF9F4] p-3 rounded-xl border border-[#2D5240]/15">
                        {user.name || "Crafter"}
                      </p>
                    </div>
                    <div>
                      <span className="block text-xs uppercase text-[#2D5240]/60 font-semibold mb-1">
                        Email Address
                      </span>
                      <p className="font-medium text-[#1A2E24] bg-[#FBF9F4] p-3 rounded-xl border border-[#2D5240]/15">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <span className="block text-xs uppercase text-[#2D5240]/60 font-semibold mb-1">
                        Membership
                      </span>
                      <p className="font-medium text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 inline-block">
                        Active Craft Account
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Sign In / Register Card */
          <div className="max-w-md mx-auto bg-white border border-[#2D5240]/15 rounded-3xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            <div className="flex bg-[#F0ECE1] p-1 rounded-full mb-8">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition cursor-pointer ${
                  isLogin
                    ? "bg-[#2D5240] text-white shadow-sm"
                    : "text-[#2D5240]/70 hover:text-[#2D5240]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition cursor-pointer ${
                  !isLogin
                    ? "bg-[#2D5240] text-white shadow-sm"
                    : "text-[#2D5240]/70 hover:text-[#2D5240]"
                }`}
              >
                Register
              </button>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-extrabold text-[#1A2E24] tracking-tight">
                {isLogin ? "Welcome Back" : "Join Stone._.Craft"}
              </h1>
              <p className="text-sm text-[#2D5240]/70 mt-1.5 font-normal">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Create an account to track your craft kits and orders"}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-[#C24B38]/10 border border-[#C24B38]/30 text-[#C24B38] text-xs font-medium rounded-2xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[#2D5240]/80 mb-1.5 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required={!isLogin}
                    className="w-full px-4 py-3 bg-[#FBF9F4] border border-[#2D5240]/20 rounded-xl text-[#1A2E24] placeholder-[#2D5240]/40 text-sm focus:outline-none focus:border-[#2D5240] focus:ring-1 focus:ring-[#2D5240] transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#2D5240]/80 mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 bg-[#FBF9F4] border border-[#2D5240]/20 rounded-xl text-[#1A2E24] placeholder-[#2D5240]/40 text-sm focus:outline-none focus:border-[#2D5240] focus:ring-1 focus:ring-[#2D5240] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#2D5240]/80 mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-[#FBF9F4] border border-[#2D5240]/20 rounded-xl text-[#1A2E24] placeholder-[#2D5240]/40 text-sm focus:outline-none focus:border-[#2D5240] focus:ring-1 focus:ring-[#2D5240] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3.5 bg-[#C24B38] hover:bg-[#A83E2D] text-white text-sm font-semibold rounded-full shadow-sm transition disabled:opacity-60 cursor-pointer"
              >
                {loading
                  ? "Connecting..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
