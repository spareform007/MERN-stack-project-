import Product from '../models/Product.js';
import Review from '../models/Review.js';

// @desc Get all products with search, filter, sorting, and pagination
// @route GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, finish, skinType, search, sort, cleanBeauty, minPrice, maxPrice, isEWGVerified } = req.query;

    let query = {};

    // Exclude hidden products unless caller is admin
    if (!req.user || req.user.role !== 'admin') {
      query.isHidden = { $ne: true };
      query.isVisible = { $ne: false };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (finish && finish !== 'All') {
      query.finish = finish;
    }

    if (skinType && skinType !== 'All') {
      query.$or = [{ skinType: skinType }, { skinTypes: skinType }, { skinType: 'All' }];
    }

    if (cleanBeauty === 'true' || isEWGVerified === 'true') {
      query.isEWGVerified = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { subCategory: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'bestseller') sortOption = { isBestSeller: -1 };

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single product by ID
// @route GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });

    res.json({
      product,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a product (Admin)
// @route POST /api/products
export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update product / toggle isHidden (Admin)
// @route PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete product (Admin)
// @route DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create product review
// @route POST /api/products/:id/reviews
export const createProductReview = async (req, res) => {
  const { rating, comment, title, verifiedShade, skinType, images } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = new Review({
        product: req.params.id,
        user: req.user._id,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        rating: Number(rating),
        title,
        comment,
        verifiedShade: verifiedShade || (product.shades?.[0]?.shadeName || ''),
        skinType: skinType || req.user.skinProfile?.skinTone || 'Medium'
      });

      await review.save();

      const reviews = await Review.find({ product: req.params.id });
      product.numReviews = reviews.length;
      product.rating = (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1);

      await product.save();

      res.status(201).json({ message: 'Review added', review, updatedRating: product.rating, numReviews: product.numReviews });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
