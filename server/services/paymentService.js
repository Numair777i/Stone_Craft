const Razorpay = require("razorpay");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Razorpay: Create order for payment
exports.createRazorpayOrder = async (amount, orderId) => {
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
  const crypto = require("crypto");
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return generated_signature === signature;
};

// Stripe: Create payment intent
exports.createStripePaymentIntent = async (amount, orderId) => {
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
  const crypto = require("crypto");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  try {
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    return { success: true, event };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

