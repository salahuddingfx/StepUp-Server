const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Get current profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let details = {};

    if (user.role === 'student') {
      details = await Student.findOne({ user: user._id }).populate('coursesEnrolled.course');
    } else if (user.role === 'teacher') {
      details = await Teacher.findOne({ user: user._id }).populate('coursesAssigned');
    }

    res.status(200).json({
      success: true,
      user,
      details
    });
  } catch (error) {
    next(error);
  }
};

// Update profile details
exports.updateProfile = async (req, res, next) => {
  const { name, avatar, email, username, targetClass } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    if (email && email !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email.toLowerCase();
      user.isEmailVerified = false;
    }

    if (username && username !== user.username) {
      const existing = await User.findOne({ username: username.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
      user.username = username.toLowerCase();
    }

    await user.save();

    if (targetClass && user.role === 'student') {
      const student = await Student.findOne({ user: user._id });
      if (student) {
        student.targetClass = targetClass;
        await student.save();
      }
    }

    const freshUser = await User.findById(user._id);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: freshUser
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Both current and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
  }

  try {
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// Admin: Toggle account status
exports.toggleUserStatus = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'suspended'}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'student') {
      await Student.findOneAndDelete({ user: id });
    } else if (user.role === 'teacher') {
      await Teacher.findOneAndDelete({ user: id });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User and linked profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update User Role (e.g. promote to teacher, demote to student)
exports.updateUserRole = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body; // admin, teacher, student

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Sync profiles based on new role
    if (role === 'teacher') {
      const existingTeacher = await Teacher.findOne({ user: id });
      if (!existingTeacher) {
        await Teacher.create({
          user: id,
          expertise: ['General English']
        });
      }
      await Student.findOneAndDelete({ user: id });
    } else if (role === 'student') {
      const existingStudent = await Student.findOne({ user: id });
      if (!existingStudent) {
        await Student.create({
          user: id,
          targetClass: 'Spoken English Learner'
        });
      }
      await Teacher.findOneAndDelete({ user: id });
    } else if (role === 'admin') {
      await Student.findOneAndDelete({ user: id });
      await Teacher.findOneAndDelete({ user: id });
    }

    res.status(200).json({
      success: true,
      message: `User role updated from ${oldRole} to ${role} successfully`,
      user
    });
  } catch (error) {
    next(error);
  }
};
