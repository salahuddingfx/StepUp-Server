const authorizeStudent = (req, res, next) => {
  if (req.user && (req.user.role === 'student' || req.user.role === 'admin' || req.user.role === 'teacher')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Student role required'
    });
  }
};

module.exports = authorizeStudent;
