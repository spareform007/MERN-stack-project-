import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true, enum: ['Tutorial', 'Skincare Guide', 'Trends', 'Ingredient Deep-Dive'] },
    readTime: { type: String, default: '5 min read' },
    author: { type: String, default: 'Mae\' Beauty Editor' },
    authorRole: { type: String, default: 'Chief Makeup Artist' },
    heroImage: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    isBeginnerFriendly: { type: Boolean, default: true },
    taggedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    tutorialSteps: [stepSchema]
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
