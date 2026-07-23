import express from 'express';
import { getBlogs, getBlogBySlug, createBlog } from '../controllers/blogController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protect, adminOnly, createBlog);

router.get('/:slug', getBlogBySlug);

export default router;
