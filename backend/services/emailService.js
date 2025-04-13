import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Mock email service for development
const mockEmailService = {
  async sendMail(options) {
    console.log('Mock email service - would send email:', {
      to: options.to,
      subject: options.subject,
      html: options.html
    });
    return {
      messageId: 'mock-message-id',
      previewUrl: 'https://example.com/mock-email-preview'
    };
  }
};

// Create transporter based on environment
const createTransporter = () => {
  console.log('Creating email transporter...');
  console.log('Email configuration:', {
    hasUser: !!process.env.EMAIL_USER,
    hasPassword: !!process.env.EMAIL_PASSWORD,
    hasFrontendUrl: !!process.env.FRONTEND_URL,
    nodeEnv: process.env.NODE_ENV
  });

  // Always use mock service in development or if no credentials
  if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Using mock email service');
    return mockEmailService;
  }

  // Production email configuration
  console.log('Using Gmail configuration');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const sendEmail = async (to, subject, html) => {
  try {
    console.log('Preparing to send email:', { to, subject });
    
    if (!process.env.FRONTEND_URL) {
      console.error('FRONTEND_URL is not set in environment variables');
      throw new Error('Frontend URL is not configured');
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'test@example.com',
      to,
      subject,
      html,
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    // Always return a consistent response in development mode
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        message: 'Mock email sent successfully',
        messageId: 'mock-message-id',
        previewUrl: 'https://example.com/mock-email-preview'
      };
    }

    return { 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId,
      previewUrl: info.previewUrl
    };
  } catch (error) {
    console.error('Email sending error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      to,
      subject
    });
    
    // In development mode, return mock response even on error
    if (process.env.NODE_ENV === 'development') {
      console.warn('Development mode: Returning mock response despite error');
      return {
        success: true,
        message: 'Mock email sent successfully',
        messageId: 'mock-message-id',
        previewUrl: 'https://example.com/mock-email-preview'
      };
    }
    
    throw new Error('Failed to send email: ' + error.message);
  }
};

export const sendConfirmationEmail = async (email, token) => {
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL is not configured');
  }

  const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email/${token}`;
  const subject = 'Confirm your EduSoft account';
  const html = `
    <h1>Welcome to EduSoft!</h1>
    <p>Please confirm your email address by clicking the link below:</p>
    <a href="${confirmationLink}">Confirm Email</a>
    <p>If you didn't create an account, you can safely ignore this email.</p>
  `;

  return sendEmail(email, subject, html);
};

export const sendPasswordResetEmail = async (email, token) => {
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL is not configured');
  }

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const subject = 'Reset your EduSoft password';
  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password. Click the link below to proceed:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
  `;

  return sendEmail(email, subject, html);
}; 