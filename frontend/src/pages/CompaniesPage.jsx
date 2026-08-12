import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CompaniesPage() {
  const companies = [
    {
      name: 'TechSoft Pvt Ltd',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      location: 'Hyderabad, India',
      jobsCount: 12,
      industry: 'IT & Software',
    },
    {
      name: 'Webify Solutions',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
      location: 'Bangalore, India',
      jobsCount: 8,
      industry: 'Web Development',
    },
    {
      name: 'DesignHub Studios',
      logo: 'https://images.unsplash.com/photo-1542744094-3a317272018a?auto=format&fit=crop&w=120&q=80',
      location: 'Hyderabad, India',
      jobsCount: 5,
      industry: 'Product Design',
    },
    {
      name: 'InnovateX Labs',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=120&q=80',
      location: 'Pune, India',
      jobsCount: 15,
      industry: 'Software Engineering',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Top Hiring Companies</h1>
          <p className="text-slate-500 text-sm mt-1">Explore leading companies actively recruiting on Job Portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((comp) => (
            <div key={comp.name} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{comp.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {comp.location}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {comp.jobsCount} Open Jobs
                </span>
                <Link to={`/jobs?search=${encodeURIComponent(comp.name)}`} className="text-slate-600 font-bold hover:text-blue-600">
                  View Jobs →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
