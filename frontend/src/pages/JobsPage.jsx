import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Briefcase, RefreshCw } from 'lucide-react';
import API from '../services/api';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query params from URL
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLocation = searchParams.get('location') || 'All Locations';
  const initialExperience = searchParams.get('experience') || 'All';
  const initialSalaryMin = searchParams.get('salaryMin') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: initialSearch,
    category: initialCategory,
    location: initialLocation,
    experience: initialExperience,
    salaryMin: initialSalaryMin,
    jobType: [],
    skill: '',
  });

  const fetchJobs = async (currentFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.location && currentFilters.location !== 'All Locations')
        params.append('location', currentFilters.location);
      if (currentFilters.experience && currentFilters.experience !== 'All')
        params.append('experience', currentFilters.experience);
      if (currentFilters.salaryMin) params.append('salaryMin', currentFilters.salaryMin);
      if (currentFilters.skill) params.append('skill', currentFilters.skill);

      if (currentFilters.jobType && currentFilters.jobType.length > 0) {
        const typesStr = Array.isArray(currentFilters.jobType)
          ? currentFilters.jobType.join(',')
          : currentFilters.jobType;
        params.append('jobType', typesStr);
      }

      const res = await API.get(`/jobs?${params.toString()}`);
      setJobs(res.data);

      // Also try fetching saved jobs if authenticated
      try {
        const savedRes = await API.get('/jobs/saved');
        setSavedJobIds(savedRes.data.map((j) => j._id));
      } catch (e) {
        // Unauthenticated or no saved jobs
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(filters);
  }, [filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setShowMobileFilters(false);
  };

  const handleFilterReset = (resetValues) => {
    setSearchTerm('');
    setFilters(resetValues);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#0D1B2A] text-white py-12 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Search Jobs</h1>
            <p className="text-slate-300 text-sm mt-2">
              Explore thousands of job opportunities from top verified employers
            </p>
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white rounded-2xl p-2 shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2.5 px-3 py-2.5 w-full sm:flex-1">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, keywords, skills or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-slate-900 text-sm focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Jobs</span>
            </button>
          </form>

          {/* Popular Search tags */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-400 pt-1">
            <span className="font-semibold text-slate-300">Popular Searches:</span>
            {['UI Designer', 'Web Developer', 'Software Engineer', 'Product Manager', 'Data Analyst'].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchTerm(tag);
                    setFilters((prev) => ({ ...prev, search: tag }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white transition-colors border border-slate-700 text-slate-300"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Mobile filter toggle button */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <p className="text-sm font-semibold text-slate-700">
            Showing <span className="font-bold text-slate-900">{jobs.length}</span> jobs
          </p>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar (Desktop) */}
          <div className="hidden lg:block">
            <JobFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleFilterReset}
            />
          </div>

          {/* Filter Sidebar (Mobile Modal) */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
              <div className="w-full max-w-xs bg-white h-full p-4 overflow-y-auto">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="mb-4 text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  ✕ Close Filters
                </button>
                <JobFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleFilterReset}
                />
              </div>
            </div>
          )}

          {/* Job List Results */}
          <div className="flex-1 w-full space-y-6">
            <div className="hidden lg:flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Recommended Jobs{' '}
                <span className="text-sm font-semibold text-slate-500">({jobs.length})</span>
              </h2>
              {filters.category && (
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-200">
                  Category: {filters.category}
                </span>
              )}
            </div>

            {loading ? (
              <Loader message="Searching open opportunities..." />
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSavedInitial={savedJobIds.includes(job._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto my-12">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No jobs match your search</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Try resetting your filters or searching for different keywords/locations.
                </p>
                <button
                  onClick={() => handleFilterReset({ location: 'All Locations', experience: 'All', salaryMin: '', jobType: [], skill: '', search: '' })}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
