import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Video,
  Calendar,
  Clock,
  User,
  Building2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';

export default function InterviewDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reschedule state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState('2026-08-28');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [rescheduling, setRescheduling] = useState(false);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/applications/${id}`);
      setApplication(res.data);
    } catch (error) {
      addToast('Application or interview details not found', 'error');
      navigate('/applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      setRescheduling(true);
      const res = await API.put(`/applications/${id}/reschedule`, {
        date: newDate,
        time: newTime,
      });

      setApplication((prev) => ({
        ...prev,
        interview: {
          ...prev.interview,
          date: newDate,
          time: newTime,
          status: 'Rescheduled',
        },
      }));

      addToast('Interview rescheduled successfully!', 'success');
      setShowRescheduleModal(false);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to reschedule interview', 'error');
    } finally {
      setRescheduling(false);
    }
  };

  if (loading) return <Loader message="Loading interview details..." />;
  if (!application) return null;

  const interview = application.interview || {
    date: '2026-08-25',
    time: '11:00 AM',
    mode: 'Online (Google Meet)',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    interviewer: 'Rohit Sharma (HR Manager)',
    message: 'Please be available 10 minutes before the interview. All the best!',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar />

          <div className="flex-1 space-y-6">
            <Link
              to="/applications"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Applications</span>
            </Link>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-8">
              {/* Header */}
              <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold mb-2">
                    <Video className="w-3.5 h-3.5" />
                    <span>Official Interview Schedule</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Interview Details
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRescheduleModal(true)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                  >
                    Reschedule
                  </button>

                  <a
                    href={interview.meetingUrl || 'https://meet.google.com/abc-defg-hij'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Join Interview</span>
                  </a>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Company</p>
                      <p className="font-extrabold text-slate-900 text-base">
                        {application.job?.company || 'TechSoft Pvt Ltd'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Position</p>
                      <p className="font-extrabold text-slate-900 text-base">
                        {application.job?.title || 'UI/UX Designer'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Interviewer</p>
                      <p className="font-extrabold text-slate-900 text-base">
                        {interview.interviewer || 'Rohit Sharma (HR Manager)'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Date & Time</p>
                      <p className="font-extrabold text-slate-900 text-base">
                        {interview.date} at {interview.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Mode</p>
                      <p className="font-extrabold text-slate-900 text-base">
                        {interview.mode || 'Online (Google Meet)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Status</p>
                      <p className="font-extrabold text-purple-700 text-base">
                        {interview.status || 'Scheduled'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message from HR */}
              <div className="p-5 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span>Message from Interviewer</span>
                </div>
                <p className="text-sm font-medium text-purple-950 italic">
                  "{interview.message || 'Please be available 10 minutes before the interview. All the best!'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900">Reschedule Interview</h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Select New Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Select New Time
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 02:00 PM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rescheduling}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {rescheduling ? 'Updating...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
