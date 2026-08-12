import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Upload,
  Plus,
  X,
  FileText,
  Trash2,
  CheckCircle,
  Camera,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function ProfilePage() {
  const { user, updateUser, refreshUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Profile form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [headline, setHeadline] = useState(user?.headline || 'UI/UX Designer');
  const [location, setLocation] = useState(user?.location || 'Hyderabad, India');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Photo upload
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Skills state
  const [skills, setSkills] = useState(user?.skills || ['UI/UX Design', 'Figma', 'Adobe XD', 'HTML', 'CSS', 'JavaScript']);
  const [newSkill, setNewSkill] = useState('');

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setHeadline(user.headline || 'UI/UX Designer');
      setLocation(user.location || 'Hyderabad, India');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setPhotoPreview(user.photo || '');
      setSkills(user.skills || []);
    }
  }, [user]);

  // Handle Photo Change
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      addToast('Image size should be less than 8MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Photo = reader.result;
      setPhotoPreview(base64Photo);

      try {
        setUploadingPhoto(true);

        const formData = new FormData();
        formData.append('photo', file);

        let finalPhoto = base64Photo;
        try {
          const res = await API.post('/users/profile/photo', formData);
          if (res.data && res.data.photo) {
            finalPhoto = res.data.photo;
          }
        } catch (uploadErr) {
          // If multipart upload fails, fallback to JSON payload with base64 string
          const res = await API.put('/users/profile', { photo: base64Photo });
          if (res.data && res.data.photo) {
            finalPhoto = res.data.photo;
          }
        }

        setPhotoPreview(finalPhoto);
        updateUser({ photo: finalPhoto });
        addToast('Profile photo updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating photo:', error);
        addToast(error.response?.data?.message || 'Error updating photo', 'error');
      } finally {
        setUploadingPhoto(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Add Skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      addToast('Skill already added', 'info');
      return;
    }
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  // Remove Skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Upload Resume
  const handleResumeSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      addToast('Only PDF, DOC, and DOCX files are allowed', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploadingResume(true);
      const res = await API.post('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ resume: res.data.resume });
      addToast('Resume uploaded successfully!', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Error uploading resume', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  // Delete Resume
  const handleDeleteResume = async () => {
    try {
      await API.delete('/users/resume');
      updateUser({
        resume: { filename: '', url: '', originalName: '', size: 0, uploadedAt: null },
      });
      addToast('Resume removed successfully', 'info');
    } catch (error) {
      addToast(error.response?.data?.message || 'Error removing resume', 'error');
    }
  };

  // Save Profile Form
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await API.put('/users/profile', {
        fullName,
        headline,
        location,
        phone,
        email,
        skills,
        photo: photoPreview,
      });
      updateUser(res.data);
      addToast('Profile updated successfully!', 'success');
      navigate('/jobs');
    } catch (error) {
      addToast(error.response?.data?.message || 'Error saving profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Dashboard Left Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="border-b border-slate-100 pb-6 mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Your Profile</h1>
                <p className="text-sm text-slate-500 mt-1">Let's get to know you better</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-8">
                {/* Profile Photo Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="relative group">
                    <img
                      src={
                        photoPreview ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-colors"
                      title="Upload Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">Profile Photo</h3>
                    <p className="text-xs text-slate-500">
                      Upload a clean, professional photo (JPG, PNG). Max 5MB.
                    </p>
                    {uploadingPhoto && <p className="text-xs text-blue-600 font-semibold animate-pulse">Uploading photo...</p>}
                  </div>
                </div>

                {/* Personal Information Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Professional Headline
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="e.g. UI/UX Designer"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Hyderabad, India"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SKILLS SECTION */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      Skills & Expertise
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add relevant skills to help employers find your profile
                    </p>
                  </div>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-2 mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-[60px] items-center">
                    {skills.length > 0 ? (
                      skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-2xs"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-red-600 p-0.5 rounded-full"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No skills added yet</span>
                    )}
                  </div>

                  {/* Add Skill Input */}
                  <div className="flex items-center gap-2 max-w-md">
                    <input
                      type="text"
                      placeholder="Add a skill (e.g. Figma, React, Python)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1 shrink-0 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      Add Skill
                    </button>
                  </div>
                </div>

                {/* RESUME SECTION */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Upload Resume
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Supported formats: PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </div>

                  {user?.resume?.url ? (
                    <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                          PDF
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {user.resume.originalName || user.resume.filename || 'john_doe_resume.pdf'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatFileSize(user.resume.size || 1258291)} • Uploaded{' '}
                            {user.resume.uploadedAt
                              ? new Date(user.resume.uploadedAt).toLocaleDateString()
                              : 'recently'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="resume-reupload"
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 font-semibold text-xs rounded-xl cursor-pointer shadow-2xs"
                        >
                          Change
                        </label>
                        <input
                          id="resume-reupload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={handleDeleteResume}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                      <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-800">
                        Select a resume file from your computer
                      </p>
                      <p className="text-xs text-slate-500 mt-1 mb-4">PDF, DOC, DOCX up to 10MB</p>
                      <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeSelect}
                          className="hidden"
                        />
                      </label>
                      {uploadingResume && (
                        <p className="text-xs text-blue-600 font-semibold mt-3 animate-pulse">
                          Uploading resume...
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                  >
                    {savingProfile ? 'Saving...' : 'Save & Continue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
