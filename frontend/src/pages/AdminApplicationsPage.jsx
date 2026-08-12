import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Filter,
  Calendar,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Award,
  Video,
  Plus,
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  Trash2,
  ShieldCheck,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

export default function AdminApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'users' | 'jobs' | 'create-job'
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const { addToast } = useToast();

  // Modals state
  const [coverLetterModal, setCoverLetterModal] = useState(null); // application object
  const [interviewModal, setInterviewModal] = useState(null); // application object
  const [offerModal, setOfferModal] = useState(null); // application object

  // Interview Form State
  const [interviewForm, setInterviewForm] = useState({
    date: '2026-08-28',
    time: '02:00 PM',
    mode: 'Online (Google Meet)',
    meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
    interviewer: 'Admin Recruitment Team',
    message: 'Please review job requirements and join 5 minutes early.',
  });

  // Offer Form State
  const [offerForm, setOfferForm] = useState({
    position: '',
    company: '',
    joiningDate: '2026-09-15',
    package: '₹8.5 LPA',
    letterUrl: '#',
  });

  // New Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    companyLogo: '',
    location: '',
    description: '',
    responsibilities: '',
    skills: '',
    experience: '1-3 years',
    salaryMin: '4',
    salaryMax: '8',
    jobType: 'Full Time',
    category: 'IT & Software',
  });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const promises = [API.get('/applications/all'), API.get('/jobs')];
      if (user?.role === 'admin') {
        promises.push(API.get('/users/all'));
      }

      const results = await Promise.all(promises);
      setApplications(results[0].data);
      setJobs(results[1].data);
      if (results[2]) {
        setUsersList(results[2].data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      addToast(error.response?.data?.message || 'Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  // Update Status Direct
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await API.put(`/applications/${appId}/status`, { status: newStatus });
      addToast(`Status updated to ${newStatus}`, 'success');
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? res.data.application : app))
      );
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  // Delete Application
  const handleDeleteApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return;
    try {
      await API.delete(`/applications/${appId}`);
      addToast('Application deleted successfully', 'success');
      setApplications((prev) => prev.filter((a) => a._id !== appId));
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete application', 'error');
    }
  };

  // User Role Update (Admin)
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await API.put(`/users/${userId}/role`, { role: newRole });
      addToast(`User role updated to ${newRole}`, 'success');
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update user role', 'error');
    }
  };

  // Delete User Account (Admin)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      await API.delete(`/users/${userId}`);
      addToast('User account deleted successfully', 'success');
      setUsersList((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  // Schedule Interview Submit
  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewModal) return;

    try {
      const res = await API.put(`/applications/${interviewModal._id}/status`, {
        status: 'Interview',
        interview: interviewForm,
      });
      addToast('Interview scheduled successfully!', 'success');
      setApplications((prev) =>
        prev.map((app) => (app._id === interviewModal._id ? res.data.application : app))
      );
      setInterviewModal(null);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to schedule interview', 'error');
    }
  };

  // Issue Offer Submit
  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    if (!offerModal) return;

    try {
      const res = await API.put(`/applications/${offerModal._id}/status`, {
        status: 'Offered',
        offerDetails: offerForm,
      });
      addToast('Job offer issued successfully!', 'success');
      setApplications((prev) =>
        prev.map((app) => (app._id === offerModal._id ? res.data.application : app))
      );
      setOfferModal(null);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to issue offer', 'error');
    }
  };

  // Create Job Submit
  const handleCreateJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', jobForm);
      addToast('New job posted successfully!', 'success');
      setJobForm({
        title: '',
        company: '',
        companyLogo: '',
        location: '',
        description: '',
        responsibilities: '',
        skills: '',
        experience: '1-3 years',
        salaryMin: '4',
        salaryMax: '8',
        jobType: 'Full Time',
        category: 'IT & Software',
      });
      setActiveTab('jobs');
      fetchAllData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to create job', 'error');
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      addToast('Job deleted successfully', 'success');
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete job', 'error');
    }
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const candidateName = app.user?.fullName?.toLowerCase() || '';
    const candidateEmail = app.user?.email?.toLowerCase() || '';
    const jobTitle = app.job?.title?.toLowerCase() || '';
    const company = app.job?.company?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      candidateName.includes(query) ||
      candidateEmail.includes(query) ||
      jobTitle.includes(query) ||
      company.includes(query);

    const matchesStatus =
      selectedStatus === 'All' || app.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Filtered Users List
  const filteredUsers = usersList.filter((u) => {
    const name = u.fullName?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    const query = userSearchQuery.toLowerCase();
    const matchesQuery = name.includes(query) || email.includes(query);
    const matchesRole =
      selectedRoleFilter === 'All' || u.role?.toLowerCase() === selectedRoleFilter.toLowerCase();
    return matchesQuery && matchesRole;
  });

  // Calculate statistics
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === 'Applied').length,
    inReview: applications.filter((a) => a.status === 'In Review').length,
    interview: applications.filter((a) => a.status === 'Interview').length,
    offered: applications.filter((a) => a.status === 'Offered').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  {user?.role === 'admin' ? 'Super Admin Portal (Full Access)' : 'Recruiter Hiring Hub'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {user?.role === 'admin' ? 'Super Admin Control Center' : 'Recruiter Candidate Portal'}
                </h1>
                <p className="text-slate-300 text-sm mt-1 max-w-xl">
                  {user?.role === 'admin'
                    ? 'Unrestricted administrative power: Manage all users, assign roles, manage job listings, review all candidate applications, schedule interviews, issue offers, or remove content.'
                    : 'Manage job applications, review applicant resumes, schedule interviews, and post new job opportunities.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'applications'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Applications ({applications.length})
                </button>

                {user?.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'users'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    Users ({usersList.length})
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'jobs'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Jobs ({jobs.length})
                </button>

                <button
                  onClick={() => setActiveTab('create-job')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'create-job'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Post Job
                </button>
              </div>
            </div>

            {loading ? (
              <Loader message="Loading control center data..." />
            ) : activeTab === 'users' && user?.role === 'admin' ? (
              /* USER MANAGEMENT TAB (Admin Only) */
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search user name or email..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-500">Role:</span>
                    {['All', 'Candidate', 'Recruiter', 'Admin'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRoleFilter(role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          selectedRoleFilter === role
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">All Registered Platform Users</h2>
                      <p className="text-xs text-slate-500">
                        Admin override: promote candidate to recruiter, elevate to admin, or remove accounts.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {filteredUsers.length} Users Found
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-3">User / Candidate</th>
                          <th className="px-5 py-3">Email & Contact</th>
                          <th className="px-5 py-3">Current Role</th>
                          <th className="px-5 py-3">Resume</th>
                          <th className="px-5 py-3 text-right">Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    u.photo ||
                                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                                  }
                                  alt={u.fullName}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
                                  }}
                                />
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{u.fullName}</p>
                                  <p className="text-[11px] text-slate-500">{u.headline || 'No headline set'}</p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-slate-800">{u.email}</p>
                              <p className="text-[11px] text-slate-400">{u.phone || u.location || 'Location not set'}</p>
                            </td>

                            <td className="px-5 py-3.5">
                              <select
                                value={u.role || 'candidate'}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                                  u.role === 'admin'
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    : u.role === 'recruiter'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                              >
                                <option value="candidate">Candidate</option>
                                <option value="recruiter">Recruiter</option>
                                <option value="admin">Super Admin</option>
                              </select>
                            </td>

                            <td className="px-5 py-3.5">
                              {u.resume?.url ? (
                                <a
                                  href={u.resume.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  View
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[11px]">None</span>
                              )}
                            </td>

                            <td className="px-5 py-3.5 text-right">
                              {u._id !== user?._id ? (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors font-bold inline-flex items-center gap-1"
                                  title="Delete User Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 uppercase">You (Current)</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : activeTab === 'jobs' ? (
              /* JOBS MANAGEMENT TAB */
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-5">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">All Published Job Postings</h2>
                    <p className="text-xs text-slate-500">View and manage all active job vacancies across companies.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('create-job')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Post New Job
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              job.companyLogo ||
                              'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80'
                            }
                            alt={job.company}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80';
                            }}
                          />
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                            <p className="text-xs text-slate-500 font-medium">{job.company}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Delete Job Opening"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold">{job.location}</span>
                        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold">{job.jobType}</span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                          ₹{job.salaryMin} - ₹{job.salaryMax} LPA
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'create-job' ? (
              /* CREATE JOB FORM VIEW */
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">Post a New Job Opening</h2>
                <p className="text-slate-500 text-xs mb-6">
                  Fill in the job details below to publish it live for candidate applications.
                </p>

                <form onSubmit={handleCreateJobSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Frontend Engineer"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TechCorp Solutions"
                        value={jobForm.company}
                        onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hyderabad, India / Remote"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={jobForm.category}
                        onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="IT & Software">IT & Software</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Engineering">Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Job Type</label>
                      <select
                        value={jobForm.jobType}
                        onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Remote">Remote</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
                      <input
                        type="text"
                        placeholder="e.g. 1-3 years"
                        value={jobForm.experience}
                        onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Min Salary (LPA)</label>
                      <input
                        type="number"
                        placeholder="4"
                        value={jobForm.salaryMin}
                        onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Max Salary (LPA)</label>
                      <input
                        type="number"
                        placeholder="8"
                        value={jobForm.salaryMax}
                        onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="React.js, Node.js, JavaScript, Tailwind CSS"
                      value={jobForm.skills}
                      onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Job Description *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Detailed overview of the job role..."
                      value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Responsibilities (One per line)</label>
                    <textarea
                      rows={3}
                      placeholder="Develop web applications&#10;Collaborate with UI designers"
                      value={jobForm.responsibilities}
                      onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-4 pt-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                    >
                      Publish Job Opening
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('applications')}
                      className="px-6 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-sm rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* APPLICATIONS LIST VIEW */
              <>
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div
                    onClick={() => setSelectedStatus('All')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStatus === 'All'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${selectedStatus === 'All' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Total Received
                    </p>
                    <p className="text-2xl font-extrabold mt-1">{stats.total}</p>
                  </div>

                  <div
                    onClick={() => setSelectedStatus('Applied')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStatus === 'Applied'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${selectedStatus === 'Applied' ? 'text-blue-100' : 'text-slate-500'}`}>
                      New Applied
                    </p>
                    <p className="text-2xl font-extrabold text-blue-500 mt-1" style={{ color: selectedStatus === 'Applied' ? '#fff' : undefined }}>
                      {stats.applied}
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedStatus('In Review')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStatus === 'In Review'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${selectedStatus === 'In Review' ? 'text-blue-100' : 'text-slate-500'}`}>
                      In Review
                    </p>
                    <p className="text-2xl font-extrabold text-amber-500 mt-1" style={{ color: selectedStatus === 'In Review' ? '#fff' : undefined }}>
                      {stats.inReview}
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedStatus('Interview')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStatus === 'Interview'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${selectedStatus === 'Interview' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Interview
                    </p>
                    <p className="text-2xl font-extrabold text-purple-600 mt-1" style={{ color: selectedStatus === 'Interview' ? '#fff' : undefined }}>
                      {stats.interview}
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedStatus('Offered')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStatus === 'Offered'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${selectedStatus === 'Offered' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Offered
                    </p>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-1" style={{ color: selectedStatus === 'Offered' ? '#fff' : undefined }}>
                      {stats.offered}
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedStatus('Rejected')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStatus === 'Rejected'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${selectedStatus === 'Rejected' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Rejected
                    </p>
                    <p className="text-2xl font-extrabold text-rose-500 mt-1" style={{ color: selectedStatus === 'Rejected' ? '#fff' : undefined }}>
                      {stats.rejected}
                    </p>
                  </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search applicant name, email, job title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                    {['All', 'Applied', 'In Review', 'Interview', 'Offered', 'Rejected'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          selectedStatus === status
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Applications List */}
                {filteredApps.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">No applications match your filter</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try clearing your search query or selecting a different application status.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApps.map((app) => (
                      <div
                        key={app._id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-xs space-y-4"
                      >
                        {/* Top Row: Candidate + Job */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                          {/* Candidate Info */}
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                app.user?.photo ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                              }
                              alt={app.user?.fullName}
                              className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 text-base">{app.user?.fullName || 'Candidate'}</h3>
                                <StatusBadge status={app.status} />
                              </div>
                              <p className="text-xs text-slate-500 font-medium">
                                {app.user?.headline || 'Job Applicant'}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3.5 h-3.5" />
                                  {app.user?.email}
                                </span>
                                {app.user?.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5" />
                                    {app.user?.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Applied Job Info */}
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 w-full md:w-auto md:min-w-[260px] flex items-center gap-3">
                            <img
                              src={
                                app.job?.companyLogo ||
                                'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80'
                              }
                              alt={app.job?.company}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80';
                              }}
                            />
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-900 truncate">{app.job?.title || 'Applied Job'}</p>
                              <p className="text-[11px] text-slate-500 truncate">{app.job?.company}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Applied: {new Date(app.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Mid Row: Actions & Attachments */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Resume Link */}
                            {app.resume?.url || app.user?.resume?.url ? (
                              <a
                                href={app.resume?.url || app.user?.resume?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-semibold border border-blue-200 hover:bg-blue-100 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                View Resume
                                <ExternalLink className="w-3 h-3 ml-0.5" />
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">No resume attached</span>
                            )}

                            {/* Cover Letter Modal Trigger */}
                            {app.coverLetter && (
                              <button
                                onClick={() => setCoverLetterModal(app)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200 hover:bg-slate-200 transition-colors"
                              >
                                Read Cover Letter
                              </button>
                            )}
                          </div>

                          {/* Status Select Dropdown & Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <span className="text-slate-500 font-bold shrink-0">Change Status:</span>
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app._id, e.target.value)}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                            >
                              <option value="Applied">Applied</option>
                              <option value="In Review">In Review</option>
                              <option value="Interview">Interview</option>
                              <option value="Offered">Offered</option>
                              <option value="Rejected">Rejected</option>
                            </select>

                            <button
                              onClick={() => {
                                setInterviewModal(app);
                                if (app.interview) {
                                  setInterviewForm({
                                    date: app.interview.date || '2026-08-28',
                                    time: app.interview.time || '02:00 PM',
                                    mode: app.interview.mode || 'Online (Google Meet)',
                                    meetingUrl: app.interview.meetingUrl || 'https://meet.google.com/xyz-uvwx-rst',
                                    interviewer: app.interview.interviewer || 'Admin Recruitment Team',
                                    message: app.interview.message || 'Please join on time.',
                                  });
                                }
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-bold transition-colors"
                            >
                              <Video className="w-3.5 h-3.5" />
                              Schedule Interview
                            </button>

                            <button
                              onClick={() => {
                                setOfferModal(app);
                                setOfferForm({
                                  position: app.job?.title || 'Software Engineer',
                                  company: app.job?.company || 'Job Portal Partner',
                                  joiningDate: app.offerDetails?.joiningDate || '2026-09-15',
                                  package: app.offerDetails?.package || '₹8.5 LPA',
                                  letterUrl: app.offerDetails?.letterUrl || '#',
                                });
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold transition-colors"
                            >
                              <Award className="w-3.5 h-3.5" />
                              Issue Offer
                            </button>

                            <button
                              onClick={() => handleDeleteApplication(app._id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                              title="Delete Application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Interview info highlight if scheduled */}
                        {app.interview && (
                          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-purple-900">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-purple-600 shrink-0" />
                              <span>
                                <strong>Interview Scheduled:</strong> {app.interview.date} at {app.interview.time} ({app.interview.mode})
                              </span>
                            </div>
                            <a
                              href={app.interview.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-700 font-bold hover:underline flex items-center gap-1 shrink-0"
                            >
                              Meeting Link <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {/* Offer info highlight if offered */}
                        {app.offerDetails && (
                          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-emerald-900">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>
                                <strong>Job Offer Issued:</strong> {app.offerDetails.position} at {app.offerDetails.company} ({app.offerDetails.package}) - Joining {app.offerDetails.joiningDate}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Cover Letter Modal */}
      {coverLetterModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setCoverLetterModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900 mb-1">Cover Letter</h3>
            <p className="text-xs text-slate-500 mb-4">
              Submitted by <strong>{coverLetterModal.user?.fullName}</strong> for{' '}
              <strong>{coverLetterModal.job?.title}</strong>
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 text-xs leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
              {coverLetterModal.coverLetter}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setCoverLetterModal(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <button
              onClick={() => setInterviewModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-bold text-lg text-slate-900">Schedule Interview</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                For Candidate: <strong>{interviewModal.user?.fullName}</strong>
              </p>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interview Date</label>
                <input
                  type="date"
                  required
                  value={interviewForm.date}
                  onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interview Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 11:00 AM / 03:30 PM"
                  value={interviewForm.time}
                  onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interview Mode</label>
                <select
                  value={interviewForm.mode}
                  onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Online (Google Meet)">Online (Google Meet)</option>
                  <option value="Online (Zoom)">Online (Zoom)</option>
                  <option value="Online (Microsoft Teams)">Online (Microsoft Teams)</option>
                  <option value="In-Person Office">In-Person Office</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Link / Address</label>
                <input
                  type="text"
                  required
                  value={interviewForm.meetingUrl}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interviewer Name</label>
                <input
                  type="text"
                  required
                  value={interviewForm.interviewer}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions / Note to Candidate</label>
                <textarea
                  rows={2}
                  value={interviewForm.message}
                  onChange={(e) => setInterviewForm({ ...interviewForm, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInterviewModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save & Notify Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Offer Modal */}
      {offerModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <button
              onClick={() => setOfferModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-bold text-lg text-slate-900">Issue Job Offer</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                For Candidate: <strong>{offerModal.user?.fullName}</strong>
              </p>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offered Position Title</label>
                <input
                  type="text"
                  required
                  value={offerForm.position}
                  onChange={(e) => setOfferForm({ ...offerForm, position: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={offerForm.company}
                  onChange={(e) => setOfferForm({ ...offerForm, company: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Joining Date</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15th September 2026"
                  value={offerForm.joiningDate}
                  onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offered Salary Package</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹8.5 LPA"
                  value={offerForm.package}
                  onChange={(e) => setOfferForm({ ...offerForm, package: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOfferModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Issue Offer
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
