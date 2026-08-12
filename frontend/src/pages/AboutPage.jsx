import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Briefcase, Target, ShieldCheck, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">About Job Portal</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Connecting Talent With Opportunity Across India
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Job Portal is India's leading full-stack career platform designed to empower professionals and hiring teams with seamless recruitment workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Our Mission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To simplify job discovery and eliminate hiring barriers through intuitive technology and real-time candidate tracking.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Verified Employers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every job posting on Job Portal undergo rigorous verification to ensure safe and genuine employment opportunities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Seamless Journey</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              From profile registration to online interviews and digital offer letters, manage your career journey in one place.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
