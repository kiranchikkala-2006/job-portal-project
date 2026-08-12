import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

// @desc    Apply for a job
// @route   POST /api/applications
export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user._id;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existingApp = await Application.findOne({ user: userId, job: jobId });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const user = await User.findById(userId);
    if (!user.resume || !user.resume.url) {
      return res.status(400).json({ message: 'Please upload a resume in your profile before applying' });
    }

    const application = await Application.create({
      user: userId,
      job: jobId,
      resume: {
        filename: user.resume.filename,
        url: user.resume.url,
        originalName: user.resume.originalName,
      },
      coverLetter: coverLetter || '',
      status: 'Applied',
    });

    const populatedApp = await Application.findById(application._id).populate('job');

    res.status(201).json({
      message: 'Application submitted successfully',
      application: populatedApp,
    });
  } catch (error) {
    console.error('applyForJob error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user applications
// @route   GET /api/applications/my
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await Application.find({ user: userId })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get application details
// @route   GET /api/applications/:id
export const getApplicationById = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    // If not admin, restrict to own application
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const application = await Application.findOne(query)
      .populate('job')
      .populate('user', 'fullName email phone photo headline location resume');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications/all
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('user', 'fullName email phone photo headline location resume')
      .populate('job')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status & schedule interview / offer (Admin)
// @route   PUT /api/applications/:id/status
export const updateApplicationStatusAndDetails = async (req, res) => {
  try {
    const { status, interview, offerDetails } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status) {
      application.status = status;
    }

    if (interview) {
      application.interview = {
        date: interview.date || '2026-08-25',
        time: interview.time || '11:00 AM',
        mode: interview.mode || 'Online (Google Meet)',
        meetingUrl: interview.meetingUrl || 'https://meet.google.com/abc-defg-hij',
        interviewer: interview.interviewer || 'HR Manager',
        message: interview.message || 'Please join on time.',
        status: interview.status || 'Scheduled',
      };
    }

    if (offerDetails) {
      application.offerDetails = {
        position: offerDetails.position || 'Software Engineer',
        company: offerDetails.company || 'Job Portal Partner',
        joiningDate: offerDetails.joiningDate || '2026-09-01',
        package: offerDetails.package || '₹8.5 LPA',
        letterUrl: offerDetails.letterUrl || '#',
      };
    }

    await application.save();

    const updatedApp = await Application.findById(application._id)
      .populate('user', 'fullName email phone photo headline location resume')
      .populate('job');

    res.json({
      message: 'Application updated successfully',
      application: updatedApp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reschedule interview

// @route   PUT /api/applications/:id/reschedule
export const rescheduleInterview = async (req, res) => {
  try {
    const { date, time } = req.body;
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!application.interview) {
      return res.status(400).json({ message: 'No interview scheduled for this application' });
    }

    if (date) application.interview.date = date;
    if (time) application.interview.time = time;
    application.interview.status = 'Rescheduled';

    await application.save();

    res.json({
      message: 'Interview rescheduled successfully',
      interview: application.interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete application (Admin / Recruiter)
// @route   DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

