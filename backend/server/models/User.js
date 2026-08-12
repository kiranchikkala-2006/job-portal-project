import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    phone: {
      type: String,
      default: '',
    },
    headline: {
      type: String,
      default: 'UI/UX Designer',
    },
    location: {
      type: String,
      default: 'Hyderabad, India',
    },
    photo: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      default: 'candidate',
    },
    skills: {
      type: [String],
      default: ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML', 'CSS', 'JavaScript'],
    },
    resetOtp: {
      type: String,
      default: '',
    },
    resetOtpExpires: {
      type: Date,
    },
    resume: {
      filename: { type: String, default: '' },
      url: { type: String, default: '' },
      originalName: { type: String, default: '' },
      size: { type: Number, default: 0 },
      uploadedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
