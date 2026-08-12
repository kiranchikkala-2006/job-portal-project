import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isRecruiterOrAdmin = user?.role === 'admin' || user?.role === 'recruiter';

  const navItems = [
    ...(isRecruiterOrAdmin
      ? [
          {
            name: user?.role === 'admin' ? 'Admin Portal' : 'Recruiter Portal',
            path: '/admin',
            icon: ShieldCheck,
          },
        ]
      : []),
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'My Applications', path: '/applications', icon: Briefcase },
    { name: 'Saved Jobs', path: '/saved-jobs', icon: Bookmark },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-full lg:w-64 bg-[#0D1B2A] text-slate-300 rounded-2xl p-5 shadow-xl flex flex-col justify-between shrink-0">
      <div>
        {/* User Brief Info Card */}
        {user && (
          <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 mb-6">
            <img
              src={
                user.photo ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
              }
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shrink-0"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
              }}
            />
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-sm truncate">{user.fullName}</h3>
                {user.role === 'admin' && (
                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 font-bold text-[9px] uppercase">
                    Admin
                  </span>
                )}
                {user.role === 'recruiter' && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-300 font-bold text-[9px] uppercase">
                    Recruiter
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-400 font-medium truncate">{user.headline || 'Job Seeker'}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.location || 'India'}</p>
            </div>
          </div>
        )}

        {/* Sidebar Nav Header */}
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {user?.role === 'admin'
            ? 'Super Admin Portal'
            : user?.role === 'recruiter'
            ? 'Recruiter Portal'
            : 'Candidate Portal'}
        </div>

        {/* Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 text-white/80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <div className="pt-6 border-t border-slate-800/80 mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
