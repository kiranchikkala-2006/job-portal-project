import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Briefcase } from 'lucide-react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/jobs/saved');
      setSavedJobs(res.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleSaveChange = (jobId, newSavedState) => {
    if (!newSavedState) {
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    }
  };

  if (loading) return <Loader message="Loading saved jobs..." />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar />

          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="border-b border-slate-100 pb-6 mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Saved Jobs ({savedJobs.length})
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Bookmarked positions you want to apply for later
                </p>
              </div>

              {savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {savedJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      isSavedInitial={true}
                      onSaveChange={handleSaveChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No saved jobs yet</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Click the bookmark icon on any job card to save it here.
                  </p>
                  <Link
                    to="/jobs"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md inline-block"
                  >
                    Browse Open Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
