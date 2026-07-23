import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'expert', 'admin'],
      default: 'customer'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    },
    points: { type: Number, default: 250 }, // Welcoming bonus points
    loyaltyPoints: { type: Number, default: 250 }, // Alias for points compatibility
    loyaltyTier: { type: String, enum: ['Bronze', 'Gold', 'Noir VIP'], default: 'Gold' },
    skinProfile: {
      tone: { type: String, enum: ['Fair', 'Light', 'Medium', 'Tan', 'Deep', 'Not Set'], default: 'Medium' },
      skinTone: { type: String, default: 'Medium' },
      undertone: { type: String, enum: ['Cool', 'Warm', 'Neutral', 'Olive', 'Not Set'], default: 'Neutral' },
      concerns: [{ type: String }],
      preferredFinish: { type: String, default: 'Dewy' }
    },
    assignedExpert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    addresses: [
      {
        fullName: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: Boolean
      }
    ]
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
