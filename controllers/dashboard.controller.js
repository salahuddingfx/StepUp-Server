const User = require('../models/User');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Payment = require('../models/Payment');

exports.getAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalCourses = await Course.countDocuments();

    // Sum completed payments
    const payments = await Payment.find({ status: 'completed' });
    const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalEnrollments = payments.length;

    // Fetch course popularity details
    const courses = await Course.find().select('title enrollmentsCount price');
    const courseStats = courses.map(c => ({
      name: c.title,
      enrollments: c.enrollmentsCount,
      revenue: c.enrollmentsCount * c.price
    }));

    // Generate monthly growth mocks or real signups group (last 6 months)
    const monthlyGrowth = [
      { month: 'Jan', students: 10, revenue: 500 },
      { month: 'Feb', students: 25, revenue: 1250 },
      { month: 'Mar', students: 45, revenue: 2200 },
      { month: 'Apr', students: 70, revenue: 3500 },
      { month: 'May', students: 110, revenue: 5600 },
      { month: 'Jun', students: totalStudents, revenue }
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        totalTeachers,
        totalCourses,
        revenue,
        totalEnrollments
      },
      courseStats,
      monthlyGrowth
    });
  } catch (error) {
    next(error);
  }
};
