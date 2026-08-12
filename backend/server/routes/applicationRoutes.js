import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getApplicationById,
  getAllApplications,
  updateApplicationStatusAndDetails,
  rescheduleInterview,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect, admin, recruiterOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, applyForJob);
router.get('/my', protect, getMyApplications);
router.get('/all', protect, recruiterOrAdmin, getAllApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, recruiterOrAdmin, updateApplicationStatusAndDetails);
router.put('/:id/reschedule', protect, rescheduleInterview);
router.delete('/:id', protect, recruiterOrAdmin, deleteApplication);

export default router;

