import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String, // e.g. "1-3 years"
      required: true,
    },
    salaryMin: {
      type: Number, // in LPA
      required: true,
    },
    salaryMax: {
      type: Number, // in LPA
      required: true,
    },
    jobType: {
      type: String, // "Full Time", "Part Time", "Remote", "Internship", "Contract"
      required: true,
    },
    category: {
      type: String, // "IT & Software", "Marketing", "Design", "Sales", "Engineering"
      required: true,
    },
    postedDate: {
      type: String, // e.g. "2 days ago"
      default: 'Recently',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
