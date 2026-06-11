const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

// Create module
exports.createModule = async (req, res, next) => {
  const { title, description, courseId, order } = req.body;

  try {
    const mod = await Module.create({
      title,
      description,
      course: courseId,
      order: order || 0
    });

    res.status(201).json({ success: true, message: 'Module created successfully', module: mod });
  } catch (error) {
    next(error);
  }
};

// Create lesson under module
exports.createLesson = async (req, res, next) => {
  const { title, description, content, videoUrl, duration, moduleId, pdfNotesUrl, order } = req.body;

  try {
    const lesson = await Lesson.create({
      title,
      description,
      content,
      videoUrl,
      duration,
      module: moduleId,
      pdfNotesUrl,
      order: order || 0
    });

    res.status(201).json({ success: true, message: 'Lesson created successfully', lesson });
  } catch (error) {
    next(error);
  }
};

// Update lesson content
exports.updateLesson = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, content, videoUrl, duration, pdfNotesUrl, order } = req.body;

  try {
    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { title, description, content, videoUrl, duration, pdfNotesUrl, order },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.status(200).json({ success: true, message: 'Lesson updated successfully', lesson });
  } catch (error) {
    next(error);
  }
};

// Get single lesson details
exports.getLessonById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findById(id).populate('module');
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

// Delete lesson
exports.deleteLesson = async (req, res, next) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    res.status(200).json({ success: true, message: 'Lesson deleted successfully' });
  } catch (error) {
    next(error);
  }
};
