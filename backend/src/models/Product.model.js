import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [{ type: String }],
    costPrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // percentage
    deliveryCharges: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    tags: [{ type: String }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false }, // false until super admin approves
    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual for discounted price
productSchema.virtual('finalPrice').get(function () {
  return this.sellingPrice - (this.sellingPrice * this.discount) / 100;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
