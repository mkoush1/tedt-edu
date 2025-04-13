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
    
    // Extract reset link from HTML
    const resetLinkMatch = options.html.match(/href="([^"]+)"/);
    if (resetLinkMatch) {
      console.log('Password reset link:', resetLinkMatch[1]);
    }
    
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
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    hasUser: !!process.env.EMAIL_USER,
    hasPassword: !!process.env.EMAIL_PASSWORD,
    hasFrontendUrl: !!process.env.FRONTEND_URL,
    nodeEnv: process.env.NODE_ENV
  });

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'test@example.com',
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendConfirmationEmail = async (email, verificationUrl) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info);
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userType) => {
  try {
    // Create reset URL with encoded token
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}&type=${userType}`;
    
    // Log the reset URL in a very visible way
    console.log('\n\n');
    console.log('==================================================');
    console.log('🚀 PASSWORD RESET LINK (COPY THIS URL):');
    console.log('==================================================');
    console.log(resetUrl);
    console.log('==================================================');
    console.log('📧 Email:', email);
    console.log('👤 User Type:', userType);
    console.log('==================================================\n\n');

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this reset, please ignore this email.</p>
      `
    };

    // In development mode, just log the reset URL and return
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - mock email sent:', {
        to: email,
        subject: mailOptions.subject,
        resetUrl: resetUrl
      });
      return { 
        messageId: 'mock-message-id',
        resetUrl: resetUrl // Include the reset URL in the response
      };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}; 