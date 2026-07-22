import express from 'express';
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateSkinProfile,
  toggleWishlist,
  subscribeNewsletter
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', protect, getUserProfile);
router.put('/skin-profile', protect, updateSkinProfile);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.post('/subscribe-newsletter', (req, res, next) => {
  if (req.headers.authorization) return protect(req, res, next);
  next();
}, subscribeNewsletter);

export default router;
