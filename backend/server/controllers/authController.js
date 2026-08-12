import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'jobconnect_super_secret_jwt_key_2026';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let selectedRole = 'candidate';
    if (role === 'recruiter') {
      selectedRole = 'recruiter';
    } else if (role === 'admin') {
      selectedRole = 'admin';
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: selectedRole,
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          headline: user.headline,
          location: user.location,
          photo: user.photo,
          skills: user.skills,
          resume: user.resume,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || 'candidate',
        phone: user.phone,
        headline: user.headline,
        location: user.location,
        photo: user.photo,
        skills: user.skills,
        resume: user.resume,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Initiate forgot password & generate OTP
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please enter your email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No registered account found with this email address.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    await user.save();

    console.log(`[AUTH] Password Reset OTP generated for ${user.email}: ${otp}`);

    // Send email with OTP code
    await sendEmail({
      to: user.email,
      subject: 'Your Password Reset Verification Code',
      text: `Your password reset code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-radius: 12px;">
          <h2 style="color: #1e293b; margin-bottom: 10px;">Password Reset Verification Code</h2>
          <p style="color: #475569; font-size: 14px;">You requested a password reset for your account. Use the code below to reset your password:</p>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #2563eb;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 12px;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: `A verification code has been sent to your email address (${user.email}).`,
      email: user.email,
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: error.message || 'Server error generating OTP' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!user.resetOtp || user.resetOtp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid verification code (OTP). Please check and try again.' });
    }

    if (user.resetOtpExpires && new Date() > new Date(user.resetOtpExpires)) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
    }

    res.json({ success: true, message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: error.message || 'Server error verifying OTP' });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!user.resetOtp || user.resetOtp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    if (user.resetOtpExpires && new Date() > new Date(user.resetOtpExpires)) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new code.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = '';
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: error.message || 'Server error resetting password' });
  }
};

