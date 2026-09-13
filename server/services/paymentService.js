const Razorpay = require("razorpay");

// Initialize Stripe only if key exists
const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// Razorpay: Create order for payment
exports.createRazorpayOrder = async (amount, orderId) => {
  if (!razorpay) return { success: false, error: "Razorpay not configured" };
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: orderId,
      notes: { orderId },
    });
    return { success: true, data: order };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Razorpay: Verify payment signature
exports.verifyRazorpayPayment = (paymentId, orderId, signature) => {
  if (!razorpay) return false;
  const crypto = require("crypto");
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return generated_signature === signature;
};

// Stripe: Create payment intent
exports.createStripePaymentIntent = async (amount, orderId) => {
  if (!stripe) return { success: false, error: "Stripe not configured" };
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "inr",
      metadata: { orderId },
    });
    return { success: true, data: intent };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Stripe: Verify webhook signature
exports.verifyStripeSignature = (body, sig) => {
  if (!stripe) return { success: false, error: "Stripe not configured" };
  const crypto = require("crypto");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  try {
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    return { success: true, event };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

