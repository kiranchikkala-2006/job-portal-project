import React from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

export default function AlertsPage() {
  const sampleAlerts = [
    {
      title: 'New UI/UX Designer job posted in Hyderabad',
      company: 'TechSoft Pvt Ltd',
      time: '2 hours ago',
    },
    {
      title: 'Your application for Frontend Developer is under review',
      company: 'Webify Solutions',
      time: '1 day ago',
    },
    {
      title: 'Interview invitation sent for Product Designer',
      company: 'DesignHub',
      time: '2 days ago',
    },
  ];

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
                  Job Alerts & Notifications
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Stay updated on application responses and new job openings matching your profile
                </p>
              </div>

              <div className="space-y-4">
                {sampleAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm">{alert.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {alert.company} • {alert.time}
                      </p>
                    </div>
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
