const Student = require('../models/Student');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const Certificate = require('../models/Certificate');

// Get student dashboard statistics
exports.getDashboard = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('coursesEnrolled.course')
      .populate('quizzesTaken.quiz')
      .populate('assignmentsSubmitted.assignment');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const certificates = await Certificate.find({ student: req.user.id }).populate('course');

    // Calculate basic progress metrics
    const totalCourses = student.coursesEnrolled.length;
    const completedCourses = student.coursesEnrolled.filter(c => c.progress === 100).length;
    const averageProgress = totalCourses > 0 
      ? Math.round(student.coursesEnrolled.reduce((acc, curr) => acc + curr.progress, 0) / totalCourses) 
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        completedCourses,
        averageProgress,
        certificatesCount: certificates.length,
        attendanceRate: student.attendance.length > 0 
          ? Math.round((student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100)
          : 100
      },
      courses: student.coursesEnrolled,
      quizzes: student.quizzesTaken,
      assignments: student.assignmentsSubmitted,
      attendance: student.attendance,
      certificates
    });
  } catch (error) {
    next(error);
  }
};

// Get student ID card data
exports.getIdCard = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user', 'name email avatar role createdAt');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        studentId: student.studentId || `STU-${new Date().getFullYear()}-${String(student._id).slice(-5)}`,
        name: student.user.name,
        email: student.user.email,
        avatar: student.user.avatar,
        targetClass: student.targetClass,
        role: student.user.role,
        memberSince: student.user.createdAt,
        coursesEnrolled: student.coursesEnrolled.length,
        completedCourses: student.coursesEnrolled.filter(c => c.progress === 100).length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Enroll in a Course (direct manual enrollment or post-payment trigger)
exports.enrollInCourse = async (req, res, next) => {
  const { courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Check if already enrolled
    const isEnrolled = student.coursesEnrolled.some(c => c.course.toString() === courseId);
    if (isEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    student.coursesEnrolled.push({
      course: courseId,
      progress: 0,
      completedLessons: []
    });

    await student.save();
    
    // Increment course enrollments count
    course.enrollmentsCount += 1;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Enrolled in course successfully',
      courses: student.coursesEnrolled
    });
  } catch (error) {
    next(error);
  }
};

// Update lesson completion progress
exports.updateProgress = async (req, res, next) => {
  const { courseId, lessonId } = req.body;

  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const courseRecord = student.coursesEnrolled.find(c => c.course.toString() === courseId);
    if (!courseRecord) {
      return res.status(404).json({ success: false, message: 'Enrollment record not found for this course' });
    }

    // Add to completed lessons if not already completed
    if (!courseRecord.completedLessons.includes(lessonId)) {
      courseRecord.completedLessons.push(lessonId);

      // Fetch all lessons under the course to calculate completion percentage
      const modules = await Module.find({ course: courseId });
      const moduleIds = modules.map(m => m._id);
      const totalLessonsCount = await Lesson.countDocuments({ module: { $in: moduleIds } });

      if (totalLessonsCount > 0) {
        courseRecord.progress = Math.round((courseRecord.completedLessons.length / totalLessonsCount) * 100);
      } else {
        courseRecord.progress = 100;
      }

      await student.save();
    }

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      progress: courseRecord.progress,
      completedLessons: courseRecord.completedLessons
    });
  } catch (error) {
    next(error);
  }
};

// Log Student Attendance (Admin or automated trigger)
exports.logAttendance = async (req, res, next) => {
  const { studentId, date, status } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    student.attendance.push({
      date: date || new Date(),
      status: status || 'present'
    });

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Attendance logged successfully',
      attendance: student.attendance
    });
  } catch (error) {
    next(error);
  }
};
