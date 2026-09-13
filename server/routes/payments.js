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
      res.status(503).json({ error: result.error, message: "Payment gateway not configured. Register at razorpay.com and set env vars." });
    }
  } catch (err) {
    console.error("Razorpay create error:", err.message);
    res.status(503).json({ error: err.message, message: "Payment gateway unavailable" });
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
      return res.status(503).json({ error: "Invalid payment signature or Razorpay not configured" });
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
    console.error("Razorpay verify error:", err.message);
    res.status(503).json({ error: err.message, message: "Payment gateway unavailable" });
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
    console.error("Razorpay webhook error:", err.message);
    res.status(200).json({ success: true }); // Always 200 to prevent retry loops
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
      res.status(503).json({ error: result.error, message: "Payment gateway not configured. Register at stripe.com and set env vars." });
    }
  } catch (err) {
    console.error("Stripe create error:", err.message);
    res.status(503).json({ error: err.message, message: "Payment gateway unavailable" });
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
    console.error("Stripe confirm error:", err.message);
    res.status(503).json({ error: err.message, message: "Payment confirmation failed" });
  }
});

// Stripe webhook for async confirmation
router.post("/stripe/webhook", async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const result = verifyStripeSignature(req.body, sig);

    if (!result.success) {
      console.warn("Stripe webhook signature verification failed:", result.error);
      return res.status(200).json({ received: true }); // 200 to prevent retries
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
    console.error("Stripe webhook error:", err.message);
    res.status(200).json({ received: true }); // Always 200 to prevent retry loops
  }
});

module.exports = router;

