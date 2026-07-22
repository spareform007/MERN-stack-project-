import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String },
  quantity: { type: Number, required: true, default: 1 },
  qty: { type: Number, default: 1 },
  image: { type: String },
  price: { type: Number, required: true },
  shade: { type: String },
  selectedShade: {
    shadeName: String,
    hexColor: String,
    colorHex: String
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String }
    },
    paymentMethod: { type: String, default: 'Credit Card / Luxury Pay' },
    itemsPrice: { type: Number, default: 0.0 },
    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    discountAmount: { type: Number, default: 0.0 },
    pointsRedeemed: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, default: 0.0 },
    pointsEarned: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: true },
    paidAt: { type: Date, default: Date.now },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Order Placed', 'Shipped', 'Delivered'],
      default: 'Pending'
    },
    trackingId: { type: String, default: () => 'MAE-' + Math.floor(100000 + Math.random() * 900000) },
    trackingNumber: { type: String }
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (this.totalAmount && !this.totalPrice) this.totalPrice = this.totalAmount;
  if (this.totalPrice && !this.totalAmount) this.totalAmount = this.totalPrice;
  if (this.trackingId && !this.trackingNumber) this.trackingNumber = this.trackingId;
  if (this.trackingNumber && !this.trackingId) this.trackingId = this.trackingNumber;
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
