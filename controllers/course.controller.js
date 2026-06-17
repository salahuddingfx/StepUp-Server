const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const mongoose = require('mongoose');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// Get all courses (supports filters)
exports.getCourses = async (req, res, next) => {
  const { category, isPublished, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
  if (search) filter.title = { $regex: search, $options: 'i' };

  try {
    const courses = await Course.find(filter).populate('instructor', 'name email avatar');
    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    next(error);
  }
};

// Get single course structure
exports.getCourseById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { slug: id };
    const course = await Course.findOne(query).populate('instructor', 'name email avatar');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Fetch modules and lessons
    const modules = await Module.find({ course: course._id }).sort('order');
    const structure = [];

    for (const mod of modules) {
      const lessons = await Lesson.find({ module: mod._id }).sort('order');
      structure.push({
        _id: mod._id,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessons
      });
    }

    res.status(200).json({
      success: true,
      course,
      structure
    });
  } catch (error) {
    next(error);
  }
};

// Create a Course (Teacher or Admin)
exports.createCourse = async (req, res, next) => {
  const { title, description, category, price, thumbnail, level, duration, introVideoUrl, outcomes } = req.body;

  try {
    const course = await Course.create({
      title,
      description,
      category,
      price: price || 0,
      thumbnail,
      level,
      duration,
      introVideoUrl,
      outcomes: outcomes || [],
      instructor: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// Update Course Details
exports.updateCourse = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, category, price, thumbnail, level, duration, introVideoUrl, outcomes } = req.body;

  try {
    let course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Ensure instructor or admin edit
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this course' });
    }

    const updates = { title, description, category, price, thumbnail, level, duration, introVideoUrl, outcomes };
    if (title) {
      updates.slug = slugify(title);
    }

    course = await Course.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

// Toggle course publish state
exports.togglePublish = async (req, res, next) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course has been ${course.isPublished ? 'published' : 'unpublished'}`,
      course
    });
  } catch (error) {
    next(error);
  }
};

// Delete Course
exports.deleteCourse = async (req, res, next) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Delete linked modules and lessons
    const modules = await Module.find({ course: id });
    const moduleIds = modules.map(m => m._id);

    await Lesson.deleteMany({ module: { $in: moduleIds } });
    await Module.deleteMany({ course: id });
    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Course and all linked contents deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
