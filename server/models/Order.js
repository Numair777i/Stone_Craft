const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderId: { type: String, required: true, unique: true },
    items: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        img: { type: String },
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, default: "Processing", enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"] },
    paymentMethod: { type: String, enum: ["razorpay", "stripe"], required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    paymentId: { type: String },
    shipping: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    statusTimeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        message: { type: String },
      },
    ],
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
