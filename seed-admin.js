require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/english_stepup');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  await connectDB();

  try {
    const email = 'admin@englishstepup.com';
    
    let user = await User.findOne({ email });
    if (user) {
      console.log(`Admin user "${email}" already exists.`);
      mongoose.disconnect();
      return;
    }

    user = await User.create({
      name: 'Super Admin',
      email,
      username: 'superadmin',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    console.log('\n==================================================');
    console.log('ADMIN USER SEEDED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
    console.log(`Email:    ${email}`);
    console.log('Password: admin123');
    console.log('==================================================\n');
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedAdmin();
