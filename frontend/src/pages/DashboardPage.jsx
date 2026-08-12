import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  Bookmark,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Video,
  UserCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [appsRes, savedRes, jobsRes] = await Promise.all([
          API.get('/applications/my'),
          API.get('/jobs/saved'),
          API.get('/jobs'),
        ]);

        setApplications(appsRes.data);
        setSavedJobs(savedRes.data);
        setRecommendedJobs(jobsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter interviews and status metrics
  const interviewsList = applications.filter(
    (app) => app.status === 'Interview' || (app.interview && app.interview.status !== 'Cancelled')
  );

  const upcomingInterview = interviewsList.length > 0 ? interviewsList[0] : null;

  // Calculate Profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let score = 20; // registered
    if (user.fullName) score += 15;
    if (user.headline) score += 15;
    if (user.location) score += 10;
    if (user.photo) score += 10;
    if (user.skills && user.skills.length > 0) score += 15;
    if (user.resume && user.resume.url) score += 15;
    return score;
  };

  const profilePct = calculateProfileCompletion();

  if (loading) return <Loader message="Loading your dashboard..." />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Dashboard Dark Navy Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0D1B2A] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Candidate Overview
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {user?.fullName || 'John'}! 👋
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                  You have <span className="text-blue-400 font-bold">{applications.length} active applications</span>. Keep tracking your progress below.
                </p>
              </div>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Applications
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-3">{applications.length}</p>
                <p className="text-[11px] text-slate-400 mt-1">Submitted applications</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Interviews
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-3">{interviewsList.length}</p>
                <p className="text-[11px] text-purple-600 font-medium mt-1">Scheduled calls</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Saved Jobs
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-3">{savedJobs.length}</p>
                <p className="text-[11px] text-slate-400 mt-1">Bookmarked opportunities</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Profile Setup
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    {profilePct}%
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profilePct}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Strength score</p>
              </div>
            </div>

            {/* Upcoming Interview Highlight Banner (If Any) */}
            {upcomingInterview && upcomingInterview.interview && (
              <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-6 shadow-xl border border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                    <Video className="w-7 h-7 text-purple-300" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-500/30 text-purple-200 text-[10px] font-extrabold uppercase tracking-wider">
                      Upcoming Interview
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {upcomingInterview.job?.title || 'UI/UX Designer'} at {upcomingInterview.job?.company || 'TechSoft'}
                    </h3>
                    <p className="text-xs text-purple-200 mt-0.5">
                      📅 {upcomingInterview.interview.date} at {upcomingInterview.interview.time} ({upcomingInterview.interview.mode})
                    </p>
                  </div>
                </div>

                <Link
                  to={`/interviews/${upcomingInterview._id}`}
                  className="px-5 py-2.5 bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Recent Applications Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg">Recent Applications</h3>
                <Link
                  to="/applications"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.slice(0, 4).map((app) => (
                    <div
                      key={app._id}
                      className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60 hover:border-blue-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600 shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {app.job?.title || 'Position'}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {app.job?.company} • Applied on{' '}
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge status={app.status} />

                        {app.status === 'Interview' && (
                          <Link
                            to={`/interviews/${app._id}`}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs"
                          >
                            Interview Details
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  You haven't submitted any job applications yet.{' '}
                  <Link to="/jobs" className="text-blue-600 font-bold hover:underline">
                    Browse jobs now
                  </Link>
                </div>
              )}
            </div>

            {/* Recommended Jobs Quick Grid */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg">Recommended For You</h3>
                <Link
                  to="/jobs"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Explore Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>
                      <p className="text-xs font-bold text-emerald-700 mt-2">
                        ₹{job.salaryMin} - ₹{job.salaryMax} LPA
                      </p>
                    </div>

                    <Link
                      to={`/jobs/${job._id}`}
                      className="mt-4 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                    >
                      View Job
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
