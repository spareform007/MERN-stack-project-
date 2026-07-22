import mongoose from 'mongoose';

const shadeSchema = new mongoose.Schema({
  shadeName: { type: String, required: true },
  hexColor: { type: String, required: true, default: '#D4AF37' },
  colorHex: { type: String, default: '#D4AF37' },
  image: { type: String },
  stock: { type: Number, default: 50 }
});

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String },
  ewgScore: { type: Number, default: 1 },
  isKeyActive: { type: Boolean, default: false }
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, default: "MAE' BEAUTY" },
    tagline: { type: String, default: 'Haute Couture Formulation' },
    category: {
      type: String,
      required: true,
      default: 'Makeup'
    },
    subCategory: { type: String, required: true, default: 'General' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    stockCount: { type: Number, default: 100 },
    stock: { type: Number, default: 100 },
    description: { type: String, required: true },
    finish: {
      type: String,
      enum: ['Dewy', 'Matte', 'Satin', 'Glossy', 'Radiant', 'N/A'],
      default: 'Dewy'
    },
    skinType: [{ type: String }], // ['Dry', 'Oily', 'Sensitive', 'All', 'Combination']
    skinTypes: [{ type: String }],
    isEWGVerified: { type: Boolean, default: true },
    cleanBeauty: { type: Boolean, default: true },
    isHidden: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    shades: [shadeSchema],
    keyIngredients: [ingredientSchema],
    fullIngredientsList: { type: String },
    allergenWarnings: [{ type: String }],
    vegan: { type: Boolean, default: true },
    crueltyFree: { type: Boolean, default: true },
    images: [{ type: String }],
    heroImage: { type: String, default: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800' },
    rating: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    howToUse: { type: String, default: 'Apply evenly using fingertips or Mae Couture Applicator Brush.' },
    proTips: { type: String, default: 'Mix 1 drop of Royal Nectar Serum for an amplified glass-skin glow.' },
    frequentlyBoughtTogether: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
