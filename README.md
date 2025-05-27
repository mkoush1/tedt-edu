# EduSoft - Educational Management System

EduSoft is a comprehensive educational management system that provides a platform for supervisors and users to manage educational content and track progress.

## What's New in Version 1.2

- **CEFR Language Assessment Package**: A complete assessment framework based on the Common European Framework of Reference for Languages (CEFR)
  - Supports all six CEFR levels (A1, A2, B1, B2, C1, C2)
  - Includes assessment materials for all four skills: Reading, Writing, Listening, and Speaking
  - Detailed rubrics and scoring guidelines for each skill and level
- **Enhanced AI Writing Assessment**: Improved evaluation criteria and more detailed feedback
- **Integrated Listening Assessment**: Real audio files and transcripts for comprehensive listening evaluation

## Features

- User Authentication (Login/Signup)
- Role-based Access Control (Supervisor/User)
- Dashboard for both roles
- Password Reset functionality
- Modern and responsive UI
- AI-powered Writing Assessment with academic criteria evaluation
- CEFR-aligned Language Assessment tools

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- OpenAI API (for AI writing assessment)

## Project Structure

```
EduSoft/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── utils/             # Utility functions
│   └── public/                # Static assets
│
├── backend/                   # Node.js backend application
│   ├── src/
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── utils/             # Utility functions
│   └── config/                # Configuration files
│
└── CEFR_Language_Assessment_Package/  # Language assessment resources
    ├── cefr_reading_*         # Reading assessment materials
    ├── cefr_writing_*         # Writing assessment materials
    ├── cefr_listening_*       # Listening assessment materials
    ├── cefr_speaking_*        # Speaking assessment materials
    └── cefr_assessment_*      # Assessment framework documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- OpenAI API key (for AI writing assessment feature)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mkoush1/tedt-edu.git
cd EduSoft
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a .env file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Documentation

### Authentication Endpoints
- POST /api/auth/login - User login
- POST /api/auth/signup - User registration
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password

### User Endpoints
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

### Supervisor Endpoints
- GET /api/supervisors/dashboard - Get supervisor dashboard data
- POST /api/supervisors/create-course - Create new course

### Writing Assessment Endpoints
- POST /api/writing-assessment/evaluate - Evaluate a writing submission

### CEFR Assessment Endpoints
- GET /api/cefr/assessment/:level/:language/:skill - Get assessment data
- POST /api/cefr/evaluate/:level/:language/:skill - Evaluate assessment submission

## AI Writing Assessment

The system includes an AI-powered writing assessment that evaluates written responses based on five academic criteria:

1. Coherence and Clarity
2. Organization and Structure
3. Focus and Content Development
4. Vocabulary and Word Choice
5. Grammar and Conventions

Each criterion is evaluated on a scale of 1-10, with detailed feedback provided. The overall score is calculated as a percentage.

For more details, see [AI Writing Assessment Documentation](docs/ai-writing-assessment.md).

## CEFR Language Assessment

The CEFR Language Assessment Package provides comprehensive tools for evaluating language proficiency across all six CEFR levels:

- **A1 & A2**: Basic language user
- **B1 & B2**: Independent language user
- **C1 & C2**: Proficient language user

Assessment materials are provided for all four language skills (reading, writing, listening, speaking), with detailed rubrics and evaluation criteria for each level.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Mohammad - [GitHub](https://github.com/mkoush1) 