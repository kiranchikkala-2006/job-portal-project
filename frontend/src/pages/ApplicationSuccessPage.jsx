import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, LayoutDashboard, Briefcase, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ApplicationSuccessPage() {
  const location = useLocation();
  const jobTitle = location.state?.jobTitle || 'UI/UX Designer';
  const company = location.state?.company || 'TechSoft Pvt Ltd';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl text-center space-y-6">
          {/* Green Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Submitted!
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your application for <span className="font-bold text-slate-900">{jobTitle}</span> at{' '}
              <span className="font-bold text-blue-600">{company}</span> has been submitted successfully.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 text-left space-y-1">
            <p className="font-bold text-slate-800">What happens next?</p>
            <p>1. The hiring team will review your application and resume.</p>
            <p>2. You can track status updates anytime in your Candidate Dashboard.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/dashboard"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>

            <Link
              to="/jobs"
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore More Jobs</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
