const Quiz = require('../models/Quiz');
const Student = require('../models/Student');

// Create quiz (Teacher/Admin)
exports.createQuiz = async (req, res, next) => {
  const { title, questions, timeLimit, passingScore, lessonId } = req.body;

  try {
    const quiz = await Quiz.create({
      title,
      questions,
      timeLimit,
      passingScore,
      lesson: lessonId
    });

    res.status(201).json({ success: true, message: 'Quiz created successfully', quiz });
  } catch (error) {
    next(error);
  }
};

// Fetch single quiz (students will fetch this to take it)
exports.getQuizById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    // In production, we might want to strip the correct answers from payload, but for simple platform we send it
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// Student submit quiz answers
exports.submitQuiz = async (req, res, next) => {
  const { quizId, answers } = req.body; // answers: array of selected option indices

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && answers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Log the result
    student.quizzesTaken.push({
      quiz: quizId,
      score,
      totalPoints: 100,
      passed
    });

    await student.save();

    res.status(200).json({
      success: true,
      message: passed ? 'Congratulations! You passed the quiz.' : 'You did not pass. Try again.',
      results: {
        score,
        correctAnswers: correctCount,
        totalQuestions: quiz.questions.length,
        passed
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete quiz (Teacher/Admin)
exports.deleteQuiz = async (req, res, next) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all quizzes (Teacher/Admin)
exports.getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find()
      .populate({
        path: 'lesson',
        populate: {
          path: 'module',
          populate: {
            path: 'course'
          }
        }
      });

    res.status(200).json({ success: true, count: quizzes.length, quizzes });
  } catch (error) {
    next(error);
  }
};
