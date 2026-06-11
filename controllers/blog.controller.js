const Blog = require('../models/Blog');

// Helpers: Generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Create Blog
exports.createBlog = async (req, res, next) => {
  const { title, content, tags, coverImage, isPublished } = req.body;

  try {
    const slug = slugify(title) + '-' + Date.now().toString().slice(-4);
    const blog = await Blog.create({
      title,
      slug,
      content,
      tags,
      coverImage,
      isPublished,
      author: req.user.id
    });

    res.status(201).json({ success: true, message: 'Blog created successfully', blog });
  } catch (error) {
    next(error);
  }
};

// Get all blogs (supports filtering for published/drafts)
exports.getBlogs = async (req, res, next) => {
  const { isPublished } = req.query;
  const filter = {};
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

  try {
    const blogs = await Blog.find(filter).populate('author', 'name avatar').sort('-createdAt');
    res.status(200).json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    next(error);
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const blog = await Blog.findOne({ slug }).populate('author', 'name avatar');
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// Edit Blog
exports.updateBlog = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, tags, coverImage, isPublished } = req.body;

  try {
    let blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this article' });
    }

    const updates = { content, tags, coverImage, isPublished };
    if (title) {
      updates.title = title;
      updates.slug = slugify(title) + '-' + Date.now().toString().slice(-4);
    }

    blog = await Blog.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({ success: true, message: 'Blog updated successfully', blog });
  } catch (error) {
    next(error);
  }
};

// Delete Blog
exports.deleteBlog = async (req, res, next) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this article' });
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Blog article deleted' });
  } catch (error) {
    next(error);
  }
};
