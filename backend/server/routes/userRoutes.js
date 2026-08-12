import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  uploadResume,
  deleteResume,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/profile/photo', protect, upload.single('photo'), uploadProfilePhoto);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.delete('/resume', protect, deleteResume);

// Admin User Management Routes
router.get('/all', protect, admin, getAllUsers);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

export default router;

