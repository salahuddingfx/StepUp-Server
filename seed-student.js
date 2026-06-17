require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/english_stepup');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedStudent = async () => {
  await connectDB();

  try {
    const email = 'student@englishstepup.com';
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log(`Student user "${email}" already exists in the database.`);
      mongoose.disconnect();
      return;
    }

    // Create user in DB (password will be automatically hashed by User model pre-save hook)
    user = await User.create({
      name: 'Demo Student',
      email,
      password: 'password123',
      role: 'student',
      isEmailVerified: true,
      isActive: true
    });

    // Create student profile
    await Student.create({
      user: user._id,
      targetClass: 'Spoken English Learner'
    });

    console.log('\n==================================================');
    console.log('STUDENT USER SEEDED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
    console.log(`Email:    ${email}`);
    console.log('Password: password123');
    console.log('==================================================\n');

  } catch (error) {
    console.error('Failed to seed student user:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedStudent();
