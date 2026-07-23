import Blog from '../models/Blog.js';

// @desc Get all blogs / makeup guides
// @route GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('taggedProducts').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single blog by slug
// @route GET /api/blogs/:slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('taggedProducts').populate('tutorialSteps.productId');
    if (!blog) {
      return res.status(404).json({ message: 'Beauty guide not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a blog / guide (Admin)
// @route POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
