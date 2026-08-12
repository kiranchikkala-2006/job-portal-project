import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Building2,
  CheckCircle2,
  Award,
  ArrowLeft,
  Send,
  Share2,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobAndUserStatus = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);

        // Check if user saved or applied
        if (user) {
          try {
            const savedRes = await API.get('/jobs/saved');
            setIsSaved(savedRes.data.some((j) => j._id === id));

            const appsRes = await API.get('/applications/my');
            setHasApplied(appsRes.data.some((app) => app.job?._id === id || app.job === id));
          } catch (e) {
            // ignore error if not loaded
          }
        }
      } catch (error) {
        addToast('Job not found', 'error');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndUserStatus();
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      addToast('Please login to save jobs', 'info');
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await API.delete(`/jobs/${id}/save`);
        setIsSaved(false);
        addToast('Job unsaved', 'info');
      } else {
        await API.post(`/jobs/${id}/save`);
        setIsSaved(true);
        addToast('Job saved to bookmarks', 'success');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Error saving job', 'error');
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      addToast('Please login to apply for this job', 'info');
      navigate('/login');
      return;
    }
    navigate(`/jobs/${id}/apply`);
  };

  if (loading) return <Loader message="Loading job details..." />;
  if (!job) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>

        {/* Top Job Overview Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80';
                    }}
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>
                <p className="text-base font-semibold text-blue-600 mt-1">{job.company}</p>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Posted {job.postedDate || 'recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleToggleSave}
                className={`p-3 rounded-2xl border transition-colors flex items-center gap-2 text-xs font-bold ${
                  isSaved
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save Job'}</span>
              </button>

              {hasApplied ? (
                <Link
                  to="/applications"
                  className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Already Applied</span>
                </Link>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-slate-700">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Salary Package</p>
              <p className="text-base font-extrabold text-emerald-700 mt-1 flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                ₹{job.salaryMin} - ₹{job.salaryMax} LPA
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Job Type</p>
              <p className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-blue-600" />
                {job.jobType}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience Level</p>
              <p className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1">
                <Award className="w-4 h-4 text-purple-600" />
                {job.experience}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</p>
              <p className="text-base font-bold text-slate-900 mt-1">{job.category}</p>
            </div>
          </div>
        </div>

        {/* Content Section: Job Description & Responsibilities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                  Job Description
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Required */}
              {job.skills && job.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                    Skills Required
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Company Summary & Application Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                About the Company
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{job.company}</p>
                  <p className="text-xs text-slate-500">{job.location}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {job.company} is an industry leader providing cutting-edge solutions across India.
                Join a dynamic team of innovators and creators.
              </p>

              <div className="pt-2">
                {hasApplied ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs font-bold text-emerald-800">
                    Application Already Submitted
                  </div>
                ) : (
                  <button
                    onClick={handleApplyClick}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Apply For This Position</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
