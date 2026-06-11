const authorizeTeacher = (req, res, next) => {
  if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Teacher role required'
    });
  }
};

module.exports = authorizeTeacher;
