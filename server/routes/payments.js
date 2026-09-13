const router = require("express").Router();
const Order = require("../models/Order");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripePaymentIntent,
  verifyStripeSignature,
} = require("../services/paymentService");
const {
  sendOrderConfirmation,
  sendPaymentConfirmation,
} = require("../services/emailService");

// Initiate Razorpay payment
router.post("/razorpay/create", async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const result = await createRazorpayOrder(amount, orderId);
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Razorpay payment
router.post("/razorpay/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      req.body;

    const isValid = verifyRazorpayPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    );

    if (!isValid) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update order payment status
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: "completed",
        paymentId: razorpay_payment_id,
        status: "Confirmed",
      },
      { new: true },
    );

    // Send payment confirmation email
    if (updatedOrder) {
      await sendPaymentConfirmation(updatedOrder, updatedOrder.shipping.email);
    }

    res.json({ success: true, message: "Payment verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Razorpay webhook for async confirmation
router.post("/razorpay/webhook", async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === "payment.authorized") {
      const { razorpay_payment_id, notes } = payload.payment.entity;
      const orderId = notes.orderId;

      // Update order
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        {
          paymentStatus: "completed",
          paymentId: razorpay_payment_id,
          status: "Confirmed",
        },
        { new: true },
      );

      if (updatedOrder) {
        await sendPaymentConfirmation(updatedOrder, updatedOrder.shipping.email);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Initiate Stripe payment
router.post("/stripe/create", async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const result = await createStripePaymentIntent(amount, orderId);
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Confirm Stripe payment
router.post("/stripe/confirm", async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Update order payment status
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: "completed",
        paymentId: paymentIntentId,
        status: "Confirmed",
      },
      { new: true },
    );

    if (updatedOrder) {
      await sendPaymentConfirmation(updatedOrder, updatedOrder.shipping.email);
    }

    res.json({ success: true, message: "Payment confirmed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook for async confirmation
router.post("/stripe/webhook", async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const result = verifyStripeSignature(req.body, sig);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const { event } = result;

    if (event.type === "payment_intent.succeeded") {
      const { id, metadata } = event.data.object;
      const orderId = metadata.orderId;

      const updatedOrder = await Order.findOneAndUpdate(
        { orderId },
        {
          paymentStatus: "completed",
          paymentId: id,
          status: "Confirmed",
        },
        { new: true },
      );

      if (updatedOrder) {
        await sendPaymentConfirmation(updatedOrder, updatedOrder.shipping.email);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

