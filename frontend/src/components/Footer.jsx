import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white">
                Job <span className="text-blue-500">Portal</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find the job that fits your career. Connecting top talent with leading enterprises companies across India.
            </p>
          </div>

          {/* Col 2: Candidates */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">For Job Seekers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-blue-400 transition-colors">Browse Jobs</Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-blue-400 transition-colors">Companies</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Candidate Dashboard</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-400 transition-colors">Upload Resume</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Popular Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs?category=IT%20%26%20Software" className="hover:text-blue-400 transition-colors">IT & Software</Link>
              </li>
              <li>
                <Link to="/jobs?category=Design" className="hover:text-blue-400 transition-colors">UI/UX Design</Link>
              </li>
              <li>
                <Link to="/jobs?category=Marketing" className="hover:text-blue-400 transition-colors">Marketing</Link>
              </li>
              <li>
                <Link to="/jobs?category=Sales" className="hover:text-blue-400 transition-colors">Sales & Business</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Sri Vasavi Engg College, Tadepalligudem, India</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@jobportal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
