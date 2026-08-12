import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Code2,
  TrendingUp,
  Palette,
  Target,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Award,
} from 'lucide-react';
import API from '../services/api';
import JobCard from '../components/JobCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await API.get('/jobs');
        setFeaturedJobs(res.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (locationQuery && locationQuery !== 'All Locations') params.append('location', locationQuery);
    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { name: 'IT & Software', icon: Code2, count: '120+ Jobs', color: 'text-blue-600 bg-blue-50' },
    { name: 'Design', icon: Palette, count: '45+ Jobs', color: 'text-purple-600 bg-purple-50' },
    { name: 'Marketing', icon: TrendingUp, count: '60+ Jobs', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Sales', icon: Target, count: '80+ Jobs', color: 'text-amber-600 bg-amber-50' },
    { name: 'Engineering', icon: Wrench, count: '50+ Jobs', color: 'text-rose-600 bg-rose-50' },
    { name: 'More Categories', icon: Briefcase, count: '100+ Jobs', color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-900 via-[#0D1B2A] to-[#0D1B2A] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text & Search Box */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Find the Job That Fits Your <span className="text-blue-400">Career</span>
              </h1>

              <p className="text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                Find the right opportunity and build your future. Connect with hiring managers and jumpstart your career today.
              </p>

              {/* Search Bar Container */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white rounded-2xl p-2.5 shadow-2xl border border-slate-200/20 flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex items-center gap-2.5 px-3 py-2.5 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search jobs, skills or companies"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none bg-transparent"
                  />
                </div>

                <div className="flex items-center gap-2.5 px-3 py-2.5 w-full sm:w-5/12">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <select
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full text-slate-900 text-sm focus:outline-none bg-transparent cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    <option value="Hyderabad, India">Hyderabad, India</option>
                    <option value="Bangalore, India">Bangalore, India</option>
                    <option value="Chennai, India">Chennai, India</option>
                    <option value="Mumbai, India">Mumbai, India</option>
                    <option value="Delhi, India">Delhi, India</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all shrink-0 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Jobs</span>
                </button>
              </form>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                <span className="font-semibold text-slate-300">Popular:</span>
                {['UI Designer', 'Web Developer', 'Software Engineer', 'Product Manager'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-600 hover:text-white transition-colors border border-slate-700 text-slate-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Hero Banner Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-md rounded-3xl p-4 border border-slate-700/80 shadow-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                    alt="Professional job seeker"
                    className="rounded-2xl w-full h-80 object-cover"
                  />
                  {/* Floating badge 1 */}
                  <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md text-slate-900 p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">100% Verified</p>
                      <p className="text-[10px] text-slate-500">Real Companies</p>
                    </div>
                  </div>

                  {/* Floating badge 2 */}
                  <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md text-slate-900 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">5,000+ Employers</p>
                      <p className="text-[10px] text-slate-500">Hiring actively</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Explore Opportunities</p>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Popular Categories</h2>
            </div>
            <Link
              to="/jobs"
              className="mt-4 md:mt-0 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() =>
                    navigate(
                      cat.name === 'More Categories'
                        ? '/jobs'
                        : `/jobs?category=${encodeURIComponent(cat.name)}`
                    )
                  }
                  className="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer group text-center flex flex-col items-center justify-center"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. RECOMMENDED JOBS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Latest Openings</p>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recommended For You</h2>
            </div>
            <Link
              to="/jobs"
              className="mt-4 md:mt-0 px-5 py-2.5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Browse All Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-10">No jobs found.</p>
          )}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Seamless Process</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How Job Portal Works</h2>
            <p className="text-slate-600 text-sm mt-2">Follow the quick steps from application to offer letter</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center relative">
              <div className="w-12 h-12 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto mb-4 text-lg shadow-md shadow-blue-600/20">
                1
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Create Account</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register with your details and build a comprehensive professional profile.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center relative">
              <div className="w-12 h-12 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto mb-4 text-lg shadow-md shadow-blue-600/20">
                2
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Add Skills & Resume</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add your technical skills as tags and upload your PDF/DOC resume.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center relative">
              <div className="w-12 h-12 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto mb-4 text-lg shadow-md shadow-blue-600/20">
                3
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Search & Apply</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by location, salary, and experience, then submit tailored cover letters.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-center relative">
              <div className="w-12 h-12 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center mx-auto mb-4 text-lg shadow-md shadow-blue-600/20">
                4
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Track & Interview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check status updates, join online interview meetings, and view offer letters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Take the Next Step in Your Career?</h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto font-normal">
            Join thousands of professionals who found their dream job through Job Portal.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all text-sm"
            >
              Get Started Now
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white font-bold rounded-xl shadow-lg transition-all text-sm"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
