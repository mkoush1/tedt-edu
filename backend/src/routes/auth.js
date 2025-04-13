import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Supervisor from '../models/supervisor.model.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get current user route
router.get('/me', verifyToken, async (req, res) => {
  try {
    // First try to find in User collection
    let user = await User.findById(req.userId).select('-password');
    let isSupervisor = false;

    // If not found in User collection, check Supervisor collection
    if (!user) {
      user = await Supervisor.findById(req.userId).select('-Password');
      isSupervisor = true;
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format response based on user type
    const userResponse = {
      id: user._id,
      fullName: isSupervisor ? user.Username : user.fullName,
      email: isSupervisor ? user.Email : user.email,
      role: isSupervisor ? 'supervisor' : user.role,
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Error in /me route:', error);
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message,
      details: 'An error occurred while fetching user information'
    });
  }
});

// User Signup
router.post('/user/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log('User signup attempt:', email);

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          fullName: !fullName ? 'Full name is required' : undefined,
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined
        }
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        details: 'An account with this email already exists'
      });
    }

    // Create new user
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'User'
    });

    await newUser.save();
    console.log('New user created:', newUser.email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('User signup error:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message
    });
  }
});

// Supervisor Signup
router.post('/supervisor/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log('Supervisor signup attempt:', email);

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          fullName: !fullName ? 'Full name is required' : undefined,
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined
        }
      });
    }

    // Check if supervisor exists
    const existingSupervisor = await Supervisor.findOne({ Email: email.toLowerCase() });
    if (existingSupervisor) {
      return res.status(400).json({ 
        message: 'Supervisor already exists',
        details: 'An account with this email already exists'
      });
    }

    // Create new supervisor
    const newSupervisor = new Supervisor({
      Username: fullName.trim(),
      Email: email.toLowerCase().trim(),
      Password: password
    });

    await newSupervisor.save();
    console.log('New supervisor created:', newSupervisor.Email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newSupervisor._id, role: 'supervisor' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Supervisor created successfully',
      token,
      supervisor: {
        id: newSupervisor._id,
        fullName: newSupervisor.Username,
        email: newSupervisor.Email,
        role: 'supervisor'
      }
    });
  } catch (error) {
    console.error('Supervisor signup error:', error);
    res.status(500).json({ 
      message: 'Error creating supervisor', 
      error: error.message
    });
  }
});

// User Login
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('\n=== User Login Attempt ===');
    console.log('Email:', email);
    console.log('Password provided:', password ? 'Yes' : 'No');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });

    const isMatch = await user.comparePassword(password);
    console.log('Final password comparison result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message
    });
  }
});

// Supervisor Login
router.post('/supervisor/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Supervisor login attempt:', email);

    // Find supervisor by email (case-insensitive)
    const supervisor = await Supervisor.findOne({ 
      Email: { $regex: new RegExp(email, 'i') } 
    });
    
    console.log('Supervisor lookup result:', supervisor ? 'Found' : 'Not found');
    
    if (!supervisor) {
      console.log('Supervisor not found for email:', email);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }

    console.log('Supervisor found:', {
      id: supervisor._id,
      email: supervisor.Email,
      username: supervisor.Username,
      hasPassword: !!supervisor.password,
      passwordLength: supervisor.password ? supervisor.password.length : 0
    });

    const isMatch = await supervisor.comparePassword(password);
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for supervisor:', email);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Email or password is incorrect'
      });
    }

    const token = jwt.sign(
      { userId: supervisor._id, role: 'supervisor' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful for supervisor:', email);

    res.json({
      token,
      user: {
        id: supervisor._id,
        fullName: supervisor.Username,
        email: supervisor.Email,
        role: 'supervisor'
      }
    });
  } catch (error) {
    console.error('Supervisor login error:', error);
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message
    });
  }
});

// User Forgot Password
router.post('/user/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('User forgot password request:', email);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        details: 'No account found with this email address'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken, 'user');

    res.json({ 
      message: 'Password reset email sent',
      details: 'Please check your email for password reset instructions'
    });
  } catch (error) {
    console.error('User forgot password error:', error);
    res.status(500).json({ 
      message: 'Error sending reset email',
      details: 'An error occurred while processing your request'
    });
  }
});

// Supervisor Forgot Password
router.post('/supervisor/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Supervisor forgot password request:', email);

    const supervisor = await Supervisor.findOne({ Email: email.toLowerCase() });
    if (!supervisor) {
      return res.status(404).json({ 
        message: 'Supervisor not found',
        details: 'No account found with this email address'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    supervisor.resetToken = resetToken;
    supervisor.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await supervisor.save();

    await sendPasswordResetEmail(supervisor.Email, resetToken, 'supervisor');

    res.json({ 
      message: 'Password reset email sent',
      details: 'Please check your email for password reset instructions'
    });
  } catch (error) {
    console.error('Supervisor forgot password error:', error);
    res.status(500).json({ 
      message: 'Error sending reset email',
      details: 'An error occurred while processing your request'
    });
  }
});

// User Reset Password
router.post('/user/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('User reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Supervisor Reset Password
router.post('/supervisor/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const supervisor = await Supervisor.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!supervisor) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    supervisor.Password = password;
    supervisor.resetToken = undefined;
    supervisor.resetTokenExpiry = undefined;
    await supervisor.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Supervisor reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, userType } = req.body;
    console.log('Forgot password request for:', { email, userType });

    // Find user by email and userType
    const UserModel = userType === 'supervisor' ? Supervisor : User;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Update user with reset token
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}&type=${userType}`;
    
    // In development, return the reset URL
    if (process.env.NODE_ENV === 'development') {
      return res.status(200).json({
        message: 'Password reset email sent',
        details: 'Please check your email for password reset instructions',
        resetUrl: resetUrl // Include the reset URL in the response
      });
    }

    await sendPasswordResetEmail(email, resetToken, userType);
    res.status(200).json({
      message: 'Password reset email sent',
      details: 'Please check your email for password reset instructions'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing password reset request' });
  }
});

export default router; 