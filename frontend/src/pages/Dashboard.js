import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import AssessmentStatus from '../components/AssessmentStatus';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [assessmentStatus, setAssessmentStatus] = useState(null);

  const handleAssessmentComplete = (status) => {
    console.log('Dashboard received new status:', status);
    setAssessmentStatus(status);
  };

  useEffect(() => {
    console.log('Dashboard mounted with user:', user);
  }, [user]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        
        {/* Assessment Status Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Assessment Progress
          </Typography>
          <AssessmentStatus 
            userId={user?._id} 
            status={assessmentStatus}
          />
        </Box>

        {/* Other dashboard content can go here */}
      </Box>
    </Container>
  );
};

export default Dashboard; 