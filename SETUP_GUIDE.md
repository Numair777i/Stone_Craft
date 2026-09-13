# Email & Payment Webhooks Setup Guide

## 1. Gmail App Password (for Email Notifications)

Emails are sent via Gmail. You need to generate an **App Password** (not your regular Gmail password).

### Steps:
1. Go to your Google Account: https://myaccount.google.com
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. Scroll down and find **App passwords**
5. Select **Mail** and **Windows Computer** (or your OS)
6. Google will generate a 16-character password
7. Copy this password

### Add to `.env`:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  (the 16-char password)
```

**Test it:** Try placing an order on your site. You should receive an email confirmation.

---

## 2. Razorpay Integration

### Get API Keys:
1. Sign up at https://razorpay.com
2. Go to **Dashboard** > **Settings** > **API Keys**
3. Copy **Key ID** and **Key Secret**

### Add to `server/.env`:
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Add to `frontend/.env.local`:
```
VITE_RAZORPAY_KEY=your_public_key
```

### Webhook Setup (Optional, for production):
Razorpay webhooks ensure payment confirmation even if user closes browser.

1. Go to **Dashboard** > **Settings** > **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/payments/razorpay/webhook`
3. Select events: `payment.authorized`, `payment.captured`
4. Add webhook secret to `.env`: `RAZORPAY_WEBHOOK_SECRET=...`

---

## 3. Stripe Integration

### Get API Keys:
1. Sign up at https://stripe.com
2. Go to **Developers** > **API Keys**
3. Copy **Secret Key** and **Publishable Key**

### Add to `server/.env`:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Webhook Setup (Required for production):
1. Go to **Developers** > **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/payments/stripe/webhook`
3. Select events: `payment_intent.succeeded`
4. Copy signing secret to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 4. Test the Payment Flow

### Local Testing (Development):

**Razorpay Test Card:**
- Card: `4111111111111111`
- Expiry: `12/25`
- CVV: `123`

**Stripe Test Card:**
- Card: `4242424242424242`
- Expiry: `12/25`
- CVV: `123`

### Test Webhook Locally:
Use **ngrok** to expose your local server to the internet:

```bash
ngrok http 5000
```

Then use the ngrok URL in webhook settings.

---

## 5. Production Deployment

Before going live:

1. **Use real Razorpay/Stripe keys** (not test keys)
2. **Enable webhooks** with your production domain
3. **Verify email settings** are using a business email
4. **Test full flow:**
   - Create account
   - Add items to cart
   - Checkout with payment
   - Verify order appears in account
   - Check email for confirmation

---

## Environment Variables Checklist

```bash
# Server (.env)
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# Razorpay
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
FRONTEND_URL=http://localhost:5173 (or your domain)

# Frontend (.env.local)
VITE_API_URL=http://localhost:5000 (or your domain)
VITE_RAZORPAY_KEY=pk_...
```

---

## Troubleshooting

**Emails not sending?**
- Check EMAIL_USER and EMAIL_PASS are correct
- Verify Gmail app password (not regular password)
- Check if Gmail blocks "less secure apps"

**Payment webhook not firing?**
- Verify webhook URL is publicly accessible
- Check webhook signing secret is correct
- Look at payment gateway logs for errors

**Order not updating after payment?**
- Check server logs for errors
- Verify payment signature verification is correct
- Make sure webhook endpoint is returning 200 OK
