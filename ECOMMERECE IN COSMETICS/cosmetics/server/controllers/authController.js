import User from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';

// @desc Auth user & get token
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('wishlist');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        skinProfile: user.skinProfile,
        loyaltyPoints: user.loyaltyPoints,
        loyaltyTier: user.loyaltyTier,
        wishlist: user.wishlist,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid luxury credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Register a new user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'A client with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      loyaltyPoints: 250, // Welcome bonus
      loyaltyTier: 'Gold'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        skinProfile: user.skinProfile,
        loyaltyPoints: user.loyaltyPoints,
        loyaltyTier: user.loyaltyTier,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user profile
// @route GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        skinProfile: user.skinProfile,
        loyaltyPoints: user.loyaltyPoints,
        loyaltyTier: user.loyaltyTier,
        wishlist: user.wishlist,
        addresses: user.addresses
      });
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update skin profile
// @route PUT /api/auth/skin-profile
export const updateSkinProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.skinProfile = {
        skinType: req.body.skinType || user.skinProfile.skinType,
        undertone: req.body.undertone || user.skinProfile.undertone,
        skinTone: req.body.skinTone || user.skinProfile.skinTone,
        concerns: req.body.concerns || user.skinProfile.concerns,
        preferredFinish: req.body.preferredFinish || user.skinProfile.preferredFinish
      };

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        skinProfile: updatedUser.skinProfile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Wishlist item
// @route POST /api/auth/wishlist/:productId
export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const existsIndex = user.wishlist.indexOf(productId);
    if (existsIndex > -1) {
      user.wishlist.splice(existsIndex, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const populatedUser = await User.findById(user._id).populate('wishlist');
    res.json({ wishlist: populatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Contextual Newsletter Subscription
// @route POST /api/auth/subscribe-newsletter
export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.loyaltyPoints = (user.loyaltyPoints || 0) + 100;
        await user.save();
        return res.json({
          status: 'vip',
          message: 'Welcome to VIP Privé! 100 points added to your account.',
          newPoints: user.loyaltyPoints
        });
      }
    }

    res.json({
      status: 'guest',
      message: 'Exclusive 15% VIP discount code unlocked!',
      promoCode: 'LUXURY15'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

