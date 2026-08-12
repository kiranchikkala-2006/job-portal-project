import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Upload,
  Building2,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Send,
  AlertCircle,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

export default function ApplyJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [uploadingResume, setUploadingResume] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoadingJob(true);
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        addToast('Job not found', 'error');
        navigate('/jobs');
      } finally {
        setLoadingJob(false);
      }
    };
    fetchJob();
  }, [id]);

  // Upload or replace resume file
  const handleResumeChange = async (e) => {
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
      addToast('Resume updated successfully!', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Error updating resume', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user?.resume?.url) {
      setErrorMsg('Please upload a resume before submitting your application');
      addToast('Please upload a resume first', 'error');
      return;
    }

    if (!agreedTerms) {
      setErrorMsg('You must agree to the terms and conditions');
      addToast('Please agree to terms and conditions', 'error');
      return;
    }

    if (coverLetter.length > 500) {
      setErrorMsg('Cover letter cannot exceed 500 characters');
      return;
    }

    try {
      setSubmitting(true);
      await API.post('/applications', {
        jobId: job._id,
        coverLetter: coverLetter,
      });

      addToast('Application submitted successfully!', 'success');
      navigate('/application-success', {
        state: { jobTitle: job.title, company: job.company },
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit application';
      setErrorMsg(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) return <Loader message="Loading application portal..." />;
  if (!job) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Details</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-8">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
              Job Application
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Apply for {job.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-2">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitApplication} className="space-y-6">
            {/* 1. Resume Section */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Resume Attachment <span className="text-red-500">*</span>
              </label>

              {user?.resume?.url ? (
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      PDF
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {user.resume.originalName || user.resume.filename || 'john_doe_resume.pdf'}
                      </p>
                      <p className="text-xs text-slate-500">
                        Uploaded resume on profile
                      </p>
                    </div>
                  </div>

                  <label className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 font-bold text-xs rounded-xl cursor-pointer shadow-2xs shrink-0">
                    {uploadingResume ? 'Uploading...' : 'Change Resume'}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="p-6 border-2 border-dashed border-red-200 bg-red-50/50 rounded-2xl text-center">
                  <FileText className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-900">No Resume Found on Your Profile</p>
                  <p className="text-xs text-slate-500 my-2">Please select a resume file to attach</p>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>Upload Resume</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* 2. Cover Letter Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Cover Letter
                </label>
                <span
                  className={`text-xs font-semibold ${
                    coverLetter.length > 500 ? 'text-red-600' : 'text-slate-400'
                  }`}
                >
                  {coverLetter.length}/500
                </span>
              </div>

              <textarea
                rows={5}
                maxLength={500}
                placeholder="Write a short cover letter explaining why you are a great fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 3. Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                I agree to the terms and conditions and confirm that all details provided in my resume and application are accurate.
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
