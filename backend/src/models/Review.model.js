import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['product', 'rider'], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
