import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const X = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  // Check admin access on mount
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
    fetchAllOrders();
  }, [user, navigate]);

  const fetchAllOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        headers: { "user-id": user.id },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order) => {
    setEditingId(order._id);
    setEditData({
      status: order.status,
      trackingNumber: order.trackingNumber || "",
      estimatedDelivery: order.estimatedDelivery
        ? new Date(order.estimatedDelivery).toISOString().split("T")[0]
        : "",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const originalOrder = orders.find(o => o._id === editingId);
      const res = await fetch(`/api/orders/${originalOrder.orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-id": user.id
        },
        body: JSON.stringify({
          status: editData.status,
          trackingNumber: editData.trackingNumber,
          estimatedDelivery: editData.estimatedDelivery || null,
        }),
      });
      const updated = await res.json();
      // Merge API response with original order to preserve all fields
      const mergedOrder = { ...originalOrder, ...updated };
      setOrders(orders.map(o => (o._id === editingId ? mergedOrder : o)));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Panel - Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet</p>
        ) : (
          <div className="overflow-x-auto bg-slate-800 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Tracking</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="px-6 py-4 text-sm text-white">{order.orderId}</td>
                    <td className="px-6 py-4 text-sm text-white">{order.shipping.fullName}</td>
                    <td className="px-6 py-4 text-sm text-white">₹{order.total}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Delivered"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : order.status === "Shipped"
                            ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                            : order.status === "Confirmed"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : order.status === "Cancelled"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{order.trackingNumber || "—"}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleEdit(order)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Update Order</h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                >
                  <option>Processing</option>
                  <option>Confirmed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={editData.trackingNumber}
                  onChange={(e) => setEditData({ ...editData, trackingNumber: e.target.value })}
                  placeholder="e.g., TRK123456789"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Est. Delivery</label>
                <input
                  type="date"
                  value={editData.estimatedDelivery}
                  onChange={(e) => setEditData({ ...editData, estimatedDelivery: e.target.value })}
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-medium"
                >
                  {saving ? "Saving..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
