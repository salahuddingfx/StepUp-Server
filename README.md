# English StepUp - API Server

Enterprise-ready Node.js + Express backend service for English StepUp EdTech platform.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-Time**: Socket.IO
- **Email**: Resend API
- **Storage**: Cloudinary API

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` values based on `.env.example`.
3. Startup development server:
   ```bash
   npm run dev
   ```

## Core API Endpoints
- `/api/v1/auth` : Login, Register, Verification OTP, password resets.
- `/api/v1/users` : Profiles updates, user accounts control.
- `/api/v1/students` : Progress updates, dashboards.
- `/api/v1/teachers` : Bios, assignments.
- `/api/v1/courses` : Catalog courses metadata and sections.
- `/api/v1/lessons` : Lecture video and notes resources.
- `/api/v1/assignments` : Submissions and grades reviews.
- `/api/v1/quizzes` : Lesson MCQ assessments.
- `/api/v1/payments` : Checkout invoices logs.
- `/api/v1/certificates` : Completion diplomas.
- `/api/v1/blogs` : Articles feed.
- `/api/v1/testimonials` : Reviews list.
- `/api/v1/notifications` : Read/unread updates.
- `/api/v1/dashboard` : Analytics dashboards.
