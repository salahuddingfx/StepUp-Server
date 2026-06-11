const Testimonial = require('../models/Testimonial');

// Post a Testimonial (Student only)
exports.createTestimonial = async (req, res, next) => {
  const { content, rating } = req.body;

  try {
    const testimonial = await Testimonial.create({
      student: req.user.id,
      content,
      rating: rating || 5
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully. It will display on the home page after admin approval.',
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// Get approved testimonials (Public display)
exports.getApprovedTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .populate('student', 'name avatar')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all reviews
exports.getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find()
      .populate('student', 'name email avatar')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: testimonials.length, testimonials });
  } catch (error) {
    next(error);
  }
};

// Admin: Toggle approval flag
exports.toggleApproval = async (req, res, next) => {
  const { id } = req.params;

  try {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    testimonial.isApproved = !testimonial.isApproved;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial approval status is now: ${testimonial.isApproved ? 'Approved' : 'Pending'}`,
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete review
exports.deleteTestimonial = async (req, res, next) => {
  const { id } = req.params;

  try {
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};
