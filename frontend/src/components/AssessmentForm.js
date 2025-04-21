import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const AssessmentForm = ({ assessment, onAssessmentComplete }) => {
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (section, index, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [index]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Submitting assessment:', {
        assessmentType: assessment.type,
        answers: formData
      });

      const response = await axios.post('/api/assessment/submit', {
        assessmentType: assessment.type,
        answers: formData
      });

      console.log('Submission response:', response.data);

      setSuccess('Assessment submitted successfully!');
      
      // Update parent component with new status
      if (onAssessmentComplete) {
        console.log('Updating parent with new status:', response.data.data.assessmentStatus);
        onAssessmentComplete(response.data.data.assessmentStatus);
      }

      // Reset form
      setFormData({});
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Your assessment form fields here */}
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={submitting}
        sx={{ mt: 3 }}
      >
        {submitting ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Submitting...
          </>
        ) : (
          'Submit Assessment'
        )}
      </Button>
    </Box>
  );
};

export default AssessmentForm; 