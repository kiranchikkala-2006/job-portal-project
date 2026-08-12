import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  Award,
  Video,
  Frown,
  CheckCircle2,
  FileText,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Applied', 'In Review', 'Interview', 'Offered', 'Rejected'];

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get('/applications/my');
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const filteredApplications =
    activeTab === 'All'
      ? applications
      : applications.filter((app) => app.status === activeTab);

  if (loading) return <Loader message="Loading your applications..." />;

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
                  My Applications
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Track real-time hiring progress, interview invites, and offers
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-100">
                {tabs.map((tab) => {
                  const count =
                    tab === 'All'
                      ? applications.length
                      : applications.filter((a) => a.status === tab).length;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        activeTab === tab
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{tab}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                          activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Applications List */}
              {filteredApplications.length > 0 ? (
                <div className="space-y-6">
                  {filteredApplications.map((app) => (
                    <div
                      key={app._id}
                      className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/60">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600 shrink-0">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base">
                              {app.job?.title || 'UI/UX Designer'}
                            </h3>
                            <p className="text-sm font-medium text-slate-600">
                              {app.job?.company || 'TechSoft Pvt Ltd'}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Applied on {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <StatusBadge status={app.status} />
                        </div>
                      </div>

                      {/* SPECIAL CONDITIONAL CARDS BASED ON APPLICATION STATUS */}

                      {/* 1. STATUS: INTERVIEW */}
                      {app.status === 'Interview' && (
                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Video className="w-5 h-5 text-purple-600 shrink-0 mt-1" />
                            <div>
                              <p className="font-bold text-purple-950 text-sm">
                                Interview Scheduled!
                              </p>
                              <p className="text-xs text-purple-800 mt-0.5">
                                📅 {app.interview?.date || '25 May 2024'} at{' '}
                                {app.interview?.time || '11:00 AM'} ({app.interview?.mode || 'Google Meet'})
                              </p>
                            </div>
                          </div>

                          <Link
                            to={`/interviews/${app._id}`}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 flex items-center gap-1.5"
                          >
                            <span>View Interview Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}

                      {/* 2. STATUS: OFFERED */}
                      {app.status === 'Offered' && (
                        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Award className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-extrabold text-emerald-950 text-base">
                                Congratulations! 🎉
                              </h4>
                              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                                You have been selected for the position of{' '}
                                <span className="font-bold">{app.job?.title}</span> at{' '}
                                <span className="font-bold">{app.job?.company}</span>!
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              alert(
                                `Offer Letter for ${app.job?.title} at ${app.job?.company}:\n\nPackage: ₹8.5 LPA\nJoining Date: 1st September 2026\nStatus: Official Selection Offer Letter Issued.`
                              )
                            }
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Offer Letter</span>
                          </button>
                        </div>
                      )}

                      {/* 3. STATUS: REJECTED */}
                      {app.status === 'Rejected' && (
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Frown className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-red-950 text-sm">Thank You for Applying</h4>
                              <p className="text-xs text-red-800 mt-0.5">
                                We regret to inform you that you were not selected for this position. Don't give up!
                              </p>
                            </div>
                          </div>

                          <Link
                            to="/jobs"
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0"
                          >
                            Keep Applying
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No applications found</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    There are no applications in the "{activeTab}" status category.
                  </p>
                  <Link
                    to="/jobs"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md inline-block"
                  >
                    Explore & Apply For Jobs
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
