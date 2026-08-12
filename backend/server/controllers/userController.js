import fs from 'fs';
import path from 'path';
import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fullName, headline, location, phone, email, skills, photo } = req.body;

    if (fullName) user.fullName = fullName;
    if (headline) user.headline = headline;
    if (location) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (photo !== undefined) user.photo = photo;
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email.toLowerCase();
    }
    if (skills && Array.isArray(skills)) {
      user.skills = skills;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      headline: updatedUser.headline,
      location: updatedUser.location,
      photo: updatedUser.photo,
      skills: updatedUser.skills,
      resume: updatedUser.resume,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile photo
// @route   POST /api/users/profile/photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let photoUrl = '';

    if (req.file) {
      // Read uploaded file buffer and turn into base64 data URI for 100% reliable image loading
      const fileBuffer = fs.readFileSync(req.file.path);
      const mimeType = req.file.mimetype || 'image/jpeg';
      photoUrl = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    } else if (req.body && req.body.photo) {
      photoUrl = req.body.photo;
    } else {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    user.photo = photoUrl;
    await user.save();

    res.json({ message: 'Profile photo updated', photo: photoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload user resume
// @route   POST /api/users/resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resume = {
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    await user.save();

    res.json({ message: 'Resume uploaded successfully', resume: user.resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user resume
// @route   DELETE /api/users/resume
export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resume = {
      filename: '',
      url: '',
      originalName: '',
      size: 0,
      uploadedAt: null,
    };

    await user.save();

    res.json({ message: 'Resume removed successfully', resume: user.resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users/all
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['candidate', 'recruiter', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account (Admin only)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves accidentally
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Super Admin cannot delete their own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

