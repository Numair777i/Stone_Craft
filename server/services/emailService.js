const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send order confirmation email
exports.sendOrderConfirmation = async (order, userEmail) => {
  const itemsList = order.items
    .map((item) => `• ${item.name} x${item.qty} — ₹${item.price * item.qty}`)
    .join("\n");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Order Confirmed: ${order.orderId} | Stone._.Craft`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2D5240;">Thank you for your order!</h2>
        <p>Hi ${order.shipping.fullName},</p>
        <p>Your order has been received and is being prepared for shipment.</p>

        <div style="background: #F7F4EC; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        </div>

        <h3 style="color: #2D5240;">Order Items:</h3>
        <pre style="background: #FBF9F4; padding: 15px; border-radius: 8px; font-family: monospace;">
${itemsList}
        </pre>

        <div style="border-top: 2px solid #2D5240; padding-top: 15px; margin-top: 20px;">
          <p><strong style="font-size: 18px; color: #1A2E24;">Total: ₹${order.total}</strong></p>
        </div>

        <h3 style="color: #2D5240; margin-top: 30px;">Shipping Address:</h3>
        <p>
          ${order.shipping.fullName}<br/>
          ${order.shipping.address}<br/>
          ${order.shipping.city}, ${order.shipping.pincode}
        </p>

        <p style="margin-top: 30px; color: #2D5240; font-size: 14px;">
          We'll notify you when your order ships. Track your order at:
          <a href="${process.env.FRONTEND_URL}/account" style="color: #C24B38;">Your Account</a>
        </p>

        <p style="margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px;">
          Questions? Contact us at ${process.env.EMAIL_USER}<br/>
          © ${new Date().getFullYear()} Stone._.Craft. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err.message };
  }
};

// Send payment confirmation email
exports.sendPaymentConfirmation = async (order, userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Payment Received: ${order.orderId} | Stone._.Craft`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2D5240;">✓ Payment Confirmed</h2>
        <p>Hi ${order.shipping.fullName},</p>
        <p>Your payment has been processed successfully. Your order is now being prepared.</p>

        <div style="background: #F7F4EC; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Amount Paid:</strong> ₹${order.total}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Status:</strong> <span style="color: #22c55e; font-weight: bold;">Completed</span></p>
        </div>

        <p style="margin-top: 30px; color: #2D5240; font-size: 14px;">
          Track your order and check shipping status:
          <a href="${process.env.FRONTEND_URL}/account" style="color: #C24B38;">View Your Order</a>
        </p>

        <p style="margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px;">
          Thank you for your purchase!<br/>
          © ${new Date().getFullYear()} Stone._.Craft
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err.message };
  }
};

// Send shipping notification
exports.sendShippingNotification = async (order, userEmail, trackingNumber) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Your order is on the way! | Stone._.Craft`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2D5240;">📦 Your Order is Shipped!</h2>
        <p>Hi ${order.shipping.fullName},</p>
        <p>Great news! Your order has been shipped and is on its way to you.</p>

        <div style="background: #F7F4EC; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ""}
          <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
        </div>

        <p style="margin-top: 30px; color: #2D5240; font-size: 14px;">
          Track your shipment:
          <a href="${process.env.FRONTEND_URL}/account" style="color: #C24B38;">Track Order</a>
        </p>

        <p style="margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px;">
          © ${new Date().getFullYear()} Stone._.Craft
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err.message };
  }
};

// Send status update email (generic for any status change)
exports.sendStatusUpdateEmail = async (order, userEmail, status) => {
  const statusMessages = {
    Shipped: {
      title: "📦 Your Order is Shipped!",
      message: "Your order has been shipped and is on its way to you.",
      emoji: "📦",
    },
    Delivered: {
      title: "✓ Order Delivered!",
      message: "Your order has been delivered. Thank you for your purchase!",
      emoji: "✓",
    },
    Processing: {
      title: "Order Processing",
      message: "Your order is being prepared for shipment.",
      emoji: "⚙️",
    },
    Confirmed: {
      title: "Order Confirmed",
      message: "Your order has been confirmed and is being prepared.",
      emoji: "✓",
    },
    Cancelled: {
      title: "Order Cancelled",
      message: "Your order has been cancelled.",
      emoji: "✕",
    },
  };

  const info = statusMessages[status] || statusMessages.Processing;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `${info.title} | Stone._.Craft`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2D5240;">${info.emoji} ${info.title}</h2>
        <p>Hi ${order.shipping.fullName},</p>
        <p>${info.message}</p>

        <div style="background: #F7F4EC; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Status:</strong> ${status}</p>
          ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ""}
          ${order.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>` : ""}
        </div>

        <p style="margin-top: 30px; color: #2D5240; font-size: 14px;">
          Track your order:
          <a href="${process.env.FRONTEND_URL}/account" style="color: #C24B38;">View Your Order</a>
        </p>

        <p style="margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px;">
          © ${new Date().getFullYear()} Stone._.Craft
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err.message };
  }
};
