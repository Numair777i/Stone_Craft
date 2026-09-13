import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function OrderTracking({ orderId, onBack }) {
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
        { headers },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-[#2D5240]">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600 mb-4">{error || "Order not found"}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#2D5240] text-white rounded-lg hover:bg-[#1A2E24] transition"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const statusColors = {
    Processing: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const statusEmojis = {
    Processing: "⚙️",
    Confirmed: "✓",
    Shipped: "📦",
    Delivered: "🎉",
    Cancelled: "✕",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#1A2E24]">{order.orderId}</h3>
          <p className="text-sm text-[#2D5240]/60">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-[#2D5240] hover:text-[#1A2E24] transition"
        >
          ← Back
        </button>
      </div>

      {/* Status Badge */}
      <div className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${statusColors[order.status] || statusColors.Processing}`}>
        {statusEmojis[order.status]} {order.status}
      </div>

      {/* Timeline */}
      <div className="bg-[#F7F4EC] rounded-2xl p-6 border border-[#2D5240]/10">
        <h4 className="font-bold text-[#1A2E24] mb-6">Order Timeline</h4>
        <div className="space-y-4">
          {order.statusTimeline && order.statusTimeline.length > 0 ? (
            order.statusTimeline.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#2D5240] rounded-full"></div>
                  {idx < order.statusTimeline.length - 1 && (
                    <div className="w-0.5 h-12 bg-[#2D5240]/20 my-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-semibold text-[#1A2E24]">{event.status}</p>
                  <p className="text-sm text-[#2D5240]/70">{event.message}</p>
                  <p className="text-xs text-[#2D5240]/50 mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#2D5240]/60 text-sm">No timeline events yet</p>
          )}
        </div>
      </div>

      {/* Tracking Info */}
      {(order.trackingNumber || order.estimatedDelivery) && (
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
          <h4 className="font-bold text-[#1A2E24] mb-4">Tracking Information</h4>
          <div className="space-y-3">
            {order.trackingNumber && (
              <div>
                <p className="text-xs font-semibold text-[#2D5240]/70 uppercase">
                  Tracking Number
                </p>
                <p className="text-sm font-mono text-[#1A2E24]">
                  {order.trackingNumber}
                </p>
              </div>
            )}
            {order.estimatedDelivery && (
              <div>
                <p className="text-xs font-semibold text-[#2D5240]/70 uppercase">
                  Estimated Delivery
                </p>
                <p className="text-sm text-[#1A2E24]">
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-[#F7F4EC] rounded-2xl p-6 border border-[#2D5240]/10">
        <h4 className="font-bold text-[#1A2E24] mb-4">Order Items</h4>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-[#2D5240]/10 last:border-b-0"
            >
              <div className="flex-1">
                <p className="font-semibold text-[#1A2E24]">{item.name}</p>
                <p className="text-sm text-[#2D5240]/60">Qty: {item.qty}</p>
              </div>
              <p className="font-semibold text-[#1A2E24]">
                ₹{item.price * item.qty}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2D5240]/10 mt-4 pt-4 flex items-center justify-between">
          <span className="font-semibold text-[#2D5240]">Total</span>
          <span className="text-xl font-bold text-[#1A2E24]">₹{order.total}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-[#F7F4EC] rounded-2xl p-6 border border-[#2D5240]/10">
        <h4 className="font-bold text-[#1A2E24] mb-4">Shipping Address</h4>
        <div className="text-sm text-[#2D5240]">
          <p className="font-semibold">{order.shipping.fullName}</p>
          <p>{order.shipping.address}</p>
          <p>
            {order.shipping.city}, {order.shipping.pincode}
          </p>
          <p className="mt-2 text-xs">{order.shipping.email}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-[#F7F4EC] rounded-2xl p-6 border border-[#2D5240]/10">
        <h4 className="font-bold text-[#1A2E24] mb-4">Payment Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#2D5240]">Payment Method</span>
            <span className="font-semibold text-[#1A2E24] capitalize">
              {order.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#2D5240]">Payment Status</span>
            <span
              className={`font-semibold ${
                order.paymentStatus === "completed"
                  ? "text-green-600"
                  : order.paymentStatus === "failed"
                    ? "text-red-600"
                    : "text-yellow-600"
              }`}
            >
              {order.paymentStatus.charAt(0).toUpperCase() +
                order.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
