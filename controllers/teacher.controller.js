const Teacher = require('../models/Teacher');
const User = require('../models/User');

// Get teacher profiles list
exports.getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().populate('user', 'name email avatar isActive');
    res.status(200).json({ success: true, count: teachers.length, teachers });
  } catch (error) {
    next(error);
  }
};

// Get single teacher info
exports.getTeacherById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findOne({ user: id }).populate('user', 'name email avatar').populate('coursesAssigned');
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    next(error);
  }
};

// Update Teacher bio and expertise
exports.updateTeacherProfile = async (req, res, next) => {
  const { bio, expertise } = req.body;

  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    if (bio) teacher.bio = bio;
    if (expertise) teacher.expertise = typeof expertise === 'string' ? expertise.split(',') : expertise;
    await teacher.save();

    res.status(200).json({
      success: true,
      message: 'Teacher profile updated successfully',
      teacher
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Approve / Reject Teacher
exports.updateTeacherStatus = async (req, res, next) => {
  const { id } = req.params;
  const { approvalStatus } = req.body; // approved, rejected, pending

  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    teacher.approvalStatus = approvalStatus;
    await teacher.save();

    res.status(200).json({
      success: true,
      message: `Teacher status updated to ${approvalStatus}`,
      teacher
    });
  } catch (error) {
    next(error);
  }
};
