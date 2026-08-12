import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  date: { type: String, default: '2026-08-25' },
  time: { type: String, default: '11:00 AM' },
  mode: { type: String, default: 'Online (Google Meet)' },
  meetingUrl: { type: String, default: 'https://meet.google.com/abc-defg-hij' },
  interviewer: { type: String, default: 'Rohit Sharma (HR Manager)' },
  message: { type: String, default: 'Please be available 10 minutes before the interview. All the best!' },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Rescheduled', 'Cancelled'], default: 'Scheduled' },
});

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    resume: {
      filename: String,
      url: String,
      originalName: String,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Applied', 'In Review', 'Interview', 'Offered', 'Rejected'],
      default: 'Applied',
    },
    interview: {
      type: interviewSchema,
      default: null,
    },
    offerDetails: {
      position: String,
      company: String,
      joiningDate: { type: String, default: '2026-09-01' },
      package: String,
      letterUrl: { type: String, default: '#' },
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate application by same user to same job
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
