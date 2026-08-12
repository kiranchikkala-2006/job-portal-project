import React, { useState } from 'react';
import { Filter, RotateCcw, MapPin, Briefcase, Award, IndianRupee, Tag } from 'lucide-react';

export default function JobFilters({ filters, onFilterChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const locations = [
    'All Locations',
    'Hyderabad, India',
    'Bangalore, India',
    'Chennai, India',
    'Pune, India',
    'Mumbai, India',
    'Delhi, India',
  ];

  const experienceOptions = ['All', '0-1 years', '1-3 years', '3-5 years', '5+ years'];

  const jobTypes = ['Full Time', 'Part Time', 'Remote', 'Internship', 'Contract'];

  const handleJobTypeToggle = (type) => {
    let currentTypes = localFilters.jobType
      ? Array.isArray(localFilters.jobType)
        ? [...localFilters.jobType]
        : localFilters.jobType.split(',')
      : [];

    if (currentTypes.includes(type)) {
      currentTypes = currentTypes.filter((t) => t !== type);
    } else {
      currentTypes.push(type);
    }

    setLocalFilters({ ...localFilters, jobType: currentTypes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const resetValues = {
      location: 'All Locations',
      experience: 'All',
      salaryMin: '',
      jobType: [],
      skill: '',
      search: '',
    };
    setLocalFilters(resetValues);
    onReset(resetValues);
  };

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs shrink-0 w-full lg:w-72">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Jobs</span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Location Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            Location
          </label>
          <select
            value={localFilters.location || 'All Locations'}
            onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            Experience
          </label>
          <div className="space-y-1.5">
            {experienceOptions.map((exp) => (
              <label key={exp} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  checked={(localFilters.experience || 'All') === exp}
                  onChange={() => setLocalFilters({ ...localFilters, experience: exp })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>{exp}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Min Salary Range */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
            Min Salary (LPA)
          </label>
          <select
            value={localFilters.salaryMin || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, salaryMin: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Salary</option>
            <option value="3">₹3+ LPA</option>
            <option value="5">₹5+ LPA</option>
            <option value="8">₹8+ LPA</option>
            <option value="10">₹10+ LPA</option>
            <option value="15">₹15+ LPA</option>
          </select>
        </div>

        {/* Job Type Checkboxes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            Job Type
          </label>
          <div className="space-y-2">
            {jobTypes.map((type) => {
              const selectedTypes = localFilters.jobType
                ? Array.isArray(localFilters.jobType)
                  ? localFilters.jobType
                  : localFilters.jobType.split(',')
                : [];
              const isChecked = selectedTypes.includes(type);

              return (
                <label key={type} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleJobTypeToggle(type)}
                    className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 border-slate-300"
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Skill Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            Skill Filter
          </label>
          <input
            type="text"
            placeholder="e.g. Figma, React, Python"
            value={localFilters.skill || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, skill: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </aside>
  );
}
