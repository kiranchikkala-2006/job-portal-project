import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  deleteJob,
  saveJob,
  unsaveJob,
  getSavedJobs,
} from '../controllers/jobController.js';
import { protect, admin, recruiterOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.post('/', protect, recruiterOrAdmin, createJob);
router.get('/saved', protect, getSavedJobs);
router.get('/:id', getJobById);
router.delete('/:id', protect, recruiterOrAdmin, deleteJob);
router.post('/:id/save', protect, saveJob);
router.delete('/:id/save', protect, unsaveJob);

export default router;
