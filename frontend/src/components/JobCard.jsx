import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, Bookmark, Clock, Building2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function JobCard({ job, isSavedInitial = false, onSaveChange }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [loadingSave, setLoadingSave] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast('Please login to save jobs', 'info');
      navigate('/login');
      return;
    }

    try {
      setLoadingSave(true);
      if (isSaved) {
        await API.delete(`/jobs/${job._id}/save`);
        setIsSaved(false);
        addToast('Job removed from saved list', 'info');
      } else {
        await API.post(`/jobs/${job._id}/save`);
        setIsSaved(true);
        addToast('Job saved to your bookmarks!', 'success');
      }
      if (onSaveChange) onSaveChange(job._id, !isSaved);
    } catch (error) {
      addToast(error.response?.data?.message || 'Error saving job', 'error');
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Company Logo, Info & Save Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80';
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <Link
                to={`/jobs/${job._id}`}
                className="font-bold text-slate-900 text-lg hover:text-blue-600 transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-0.5">
                {job.company}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSave}
            disabled={loadingSave}
            title={isSaved ? 'Unsave job' : 'Save job'}
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              isSaved
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Badges / Meta Info */}
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 my-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {job.location}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            {job.jobType}
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            ₹{job.salaryMin} - ₹{job.salaryMax} LPA
          </span>
        </div>

        {/* Skills Chips */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-3">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {job.postedDate || 'Recently'}
        </span>

        <Link
          to={`/jobs/${job._id}`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
