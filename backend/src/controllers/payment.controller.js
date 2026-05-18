import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/Order.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc  Create payment intent
// @route POST /api/payments/create-intent
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'pkr' } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: { userId: req.user._id.toString() },
  });
  res.json({ success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
});

// @desc  Stripe webhook
// @route POST /api/payments/webhook
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    await Order.findOneAndUpdate(
      { stripePaymentIntentId: pi.id },
      { paymentStatus: 'paid', status: 'confirmed', $push: { statusHistory: { status: 'confirmed', note: 'Payment confirmed' } } }
    );
  }
  res.json({ received: true });
});
