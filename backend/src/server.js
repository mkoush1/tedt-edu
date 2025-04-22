import problemSolvingRoutes from './routes/problemSolvingRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/supervisors', supervisorRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/problem-solving', problemSolvingRoutes); 