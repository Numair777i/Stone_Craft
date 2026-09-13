const router = require("express").Router();
const Order = require("../models/Order");
const User = require("../models/User");
const { sendOrderConfirmation } = require("../services/emailService");

// Middleware to check admin
const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];
    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create New Order
router.post("/", async (req, res) => {
  try {
    const { userId, orderId, items, total, status, shipping, paymentMethod } = req.body;

    if (!userId || !orderId || !items || !total || !shipping || !paymentMethod) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newOrder = new Order({
      userId,
      orderId,
      items,
      total,
      status: status || "Processing",
      paymentMethod,
      paymentStatus: "pending",
      shipping,
    });

    const savedOrder = await newOrder.save();

    // Send order confirmation email
    await sendOrderConfirmation(savedOrder, shipping.email);

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get Orders for a Specific User
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    // If no userId in query, treat as admin fetch (get all orders)
    if (!userId) {
      const adminUserId = req.headers["user-id"];
      if (!adminUserId) {
        return res.status(401).json({ error: "User ID required" });
      }
      const user = await User.findById(adminUserId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    }

    // User fetching their own orders
    const orders = await Order.find({ userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Order by ID
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Order Status
router.put("/:orderId", checkAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, estimatedDelivery, message } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Add to timeline
    const timelineEntry = {
      status,
      message: message || `Order status updated to ${status}`,
      timestamp: new Date(),
    };

    // Build update object - only update specific fields
    const updateData = {
      status,
      $push: { statusTimeline: timelineEntry },
    };

    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);

    // Use findOneAndUpdate instead of save() to avoid full validation
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      updateData,
      { new: true, runValidators: false } // new: true returns updated doc, runValidators: false skips validation on fields not being updated
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Send status update email (don't block on failure)
    try {
      const { sendStatusUpdateEmail } = require("../services/emailService");
      await sendStatusUpdateEmail(updatedOrder, updatedOrder.shipping.email, status);
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
      // Don't fail the order update if email fails
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Order update error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
