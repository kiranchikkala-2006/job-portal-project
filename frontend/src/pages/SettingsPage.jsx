import React, { useState } from 'react';
import { Settings, Shield, Bell, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Account settings saved successfully!', 'success');
  };

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
                  Account Settings
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage preferences, privacy settings, and notification alerts
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    Notification Preferences
                  </h3>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700">Email Alerts for New Matching Jobs</span>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700">SMS Notifications for Interview Invites</span>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
