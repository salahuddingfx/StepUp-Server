const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const User = require('../models/User');

// Create assignment (Teacher/Admin)
exports.createAssignment = async (req, res, next) => {
  const { title, instructions, maxPoints, fileUrl, dueDate, lessonId } = req.body;

  try {
    const assignment = await Assignment.create({
      title,
      instructions,
      maxPoints: maxPoints || 100,
      fileUrl,
      dueDate,
      lesson: lessonId
    });

    res.status(201).json({ success: true, message: 'Assignment created successfully', assignment });
  } catch (error) {
    next(error);
  }
};

// Student: Submit assignment file
exports.submitAssignment = async (req, res, next) => {
  const { assignmentId, submittedFile } = req.body;

  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Append to submissions
    student.assignmentsSubmitted.push({
      assignment: assignmentId,
      submittedFile,
      status: 'pending'
    });

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully',
      submissions: student.assignmentsSubmitted
    });
  } catch (error) {
    next(error);
  }
};

// Teacher: Grade a student's submission
exports.gradeSubmission = async (req, res, next) => {
  const { studentId, assignmentId, score, grade } = req.body;

  try {
    const student = await Student.findOne({ user: studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Find specific submission in student sublist
    const submission = student.assignmentsSubmitted.find(
      sub => sub.assignment.toString() === assignmentId
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission record not found for this assignment' });
    }

    submission.status = 'graded';
    submission.score = score;
    submission.grade = grade;

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      submission
    });
  } catch (error) {
    next(error);
  }
};

// Get all submissions for an assignment (Teacher/Admin view)
exports.getSubmissions = async (req, res, next) => {
  const { assignmentId } = req.params;

  try {
    // Look up students who submitted this assignment
    const students = await Student.find({
      'assignmentsSubmitted.assignment': assignmentId
    }).populate('user', 'name email avatar');

    const submissions = students.map(s => {
      const sub = s.assignmentsSubmitted.find(a => a.assignment.toString() === assignmentId);
      return {
        student: s.user,
        studentId: s._id,
        submittedFile: sub.submittedFile,
        status: sub.status,
        grade: sub.grade,
        score: sub.score,
        submittedAt: sub.submittedAt
      };
    });

    res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (error) {
    next(error);
  }
};
