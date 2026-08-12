import Job from '../models/Job.js';
import SavedJob from '../models/SavedJob.js';

// @desc    Get all jobs with search and filters
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const { search, location, category, experience, jobType, salaryMin, skill } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { skills: { $in: [searchRegex] } },
        { description: searchRegex },
      ];
    }

    if (location && location !== 'All Locations' && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i');
    }

    if (category && category !== 'All Categories' && category.trim() !== '') {
      query.category = category;
    }

    if (experience && experience !== 'All' && experience.trim() !== '') {
      query.experience = new RegExp(experience.trim(), 'i');
    }

    if (jobType && jobType !== 'All' && jobType.trim() !== '') {
      const types = Array.isArray(jobType) ? jobType : jobType.split(',');
      query.jobType = { $in: types.map((t) => new RegExp(t.trim(), 'i')) };
    }

    if (salaryMin) {
      const minSalary = parseFloat(salaryMin);
      if (!isNaN(minSalary)) {
        query.salaryMax = { $gte: minSalary };
      }
    }

    if (skill && skill.trim() !== '') {
      query.skills = { $in: [new RegExp(skill.trim(), 'i')] };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('getJobs error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job (Admin)
// @route   POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      companyLogo,
      location,
      description,
      responsibilities,
      skills,
      experience,
      salaryMin,
      salaryMax,
      jobType,
      category,
    } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ message: 'Title, company, location and description are required' });
    }

    const job = await Job.create({
      title,
      company,
      companyLogo: companyLogo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
      location,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n') : []),
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s) => s.trim()) : []),
      experience: experience || '1-3 years',
      salaryMin: Number(salaryMin) || 3,
      salaryMax: Number(salaryMax) || 8,
      jobType: jobType || 'Full Time',
      category: category || 'IT & Software',
      postedDate: 'Just now',
    });

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job (Admin)
// @route   DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job by ID

// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save a job
// @route   POST /api/jobs/:id/save
export const saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const existing = await SavedJob.findOne({ user: userId, job: jobId });
    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const saved = await SavedJob.create({ user: userId, job: jobId });
    res.status(201).json({ message: 'Job saved successfully', saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unsave a job
// @route   DELETE /api/jobs/:id/save
export const unsaveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    await SavedJob.findOneAndDelete({ user: userId, job: jobId });
    res.json({ message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user saved jobs
// @route   GET /api/jobs/saved
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const savedJobs = await SavedJob.find({ user: userId })
      .populate('job')
      .sort({ savedAt: -1 });

    const jobs = savedJobs.map((item) => item.job).filter(Boolean);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
