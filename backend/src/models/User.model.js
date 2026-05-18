import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    googleId: { type: String },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['user', 'admin', 'rider', 'superadmin'],
      default: 'user',
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true }, // For admins/riders: false until approved
    addresses: [
      {
        label: { type: String, default: 'Home' },
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'Pakistan' },
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerifyToken: String,
    emailVerifyExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
