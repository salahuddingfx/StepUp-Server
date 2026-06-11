require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db.config');
const corsOptions = require('./config/cors.config');
const { initSocket } = require('./config/socket.config');
const errorHandler = require('./middlewares/error.middleware');

// Initialize Express app & HTTP Server
const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Initialize Socket.io
initSocket(server);

// Global Middlewares
app.use(helmet({
  contentSecurityPolicy: false // disable for local dev asset loads
}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/students', require('./routes/student.routes'));
app.use('/api/v1/teachers', require('./routes/teacher.routes'));
app.use('/api/v1/courses', require('./routes/course.routes'));
app.use('/api/v1/lessons', require('./routes/lesson.routes'));
app.use('/api/v1/assignments', require('./routes/assignment.routes'));
app.use('/api/v1/quizzes', require('./routes/quiz.routes'));
app.use('/api/v1/payments', require('./routes/payment.routes'));
app.use('/api/v1/certificates', require('./routes/certificate.routes'));
app.use('/api/v1/blogs', require('./routes/blog.routes'));
app.use('/api/v1/testimonials', require('./routes/testimonial.routes'));
app.use('/api/v1/notifications', require('./routes/notification.routes'));
app.use('/api/v1/dashboard', require('./routes/dashboard.routes'));

// Basic Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to English StepUp API Gateway',
    timestamp: new Date()
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

// Launch HTTP Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  const asciiBanner = `
\x1b[31m  ______            _ _     _      _____ _            _    _        
\x1b[31m |  ____|          | (_)   | |    / ____| |          | |  | |       
\x1b[31m | |__   _ __   ___| |_ ___| |__ | (___ | |_ ___ _ __| |  | | _ __  
\x1b[31m |  __| | '_ \\ / _ \\ | / __| '_ \\ \\___ \\| __/ _ \\ '_ \\ |  | || '_ \\ 
\x1b[31m | |____| | | |  __/ | \\__ \\ | | |____) | ||  __/ |_) | |__| || |_) |
\x1b[31m |______|_| |_|\\___|_|_|___/_| |_|_____/ \\__\\___| .__/ \\____/ | .__/ 
\x1b[31m                                                | |           | |    
\x1b[31m                                                |_|           |_|    \x1b[0m
  
\x1b[35m========================================================================\x1b[0m
\x1b[32m  Developer:\x1b[0m  Salah uddin Kader (salahuddingfx)
\x1b[32m  Agency:\x1b[0m     Nextora Studio
\x1b[32m  Status:\x1b[0m     Empowering Growth through Modern English Learning
\x1b[32m  Server:\x1b[0m     Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode
\x1b[35m========================================================================\x1b[0m
  `;
  
  const lines = asciiBanner.split('\n');
  let index = 0;
  const interval = setInterval(() => {
    if (index < lines.length) {
      console.log(lines[index]);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 45);
});

