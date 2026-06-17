require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/english_stepup');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const runMigration = async () => {
  await connectDB();
  
  try {
    console.log('Fetching courses...');
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses.`);

    for (let course of courses) {
      const slug = slugify(course.title);
      console.log(`Course: "${course.title}" -> Slug: "${slug}"`);
      course.slug = slug;
      await course.save();
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

runMigration();
