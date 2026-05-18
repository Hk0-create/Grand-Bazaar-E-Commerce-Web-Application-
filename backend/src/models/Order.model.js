import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  quantity: { type: Number, required: true },
  color: String,
  size: String,
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'Pakistan' },
    },
    paymentMethod: { type: String, enum: ['stripe', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    stripePaymentIntentId: String,
    itemsPrice: { type: Number, required: true },
    deliveryCharges: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'assigned', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        note: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isReviewedByUser: { type: Boolean, default: false },
    isReviewedByRider: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'GB-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
