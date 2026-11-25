'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  Landmark,
  Building,
  GraduationCap,
  Sparkles,
  Clock,
  MapPin,
  ExternalLink,
  Mail,
  FileText,
  CheckCircle2,
  X,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  Globe
} from 'lucide-react';
import JobCard from '@/components/jobs/job-card';
import JobDetailModal from '@/components/jobs/job-detail-modal';
import CVTailorModal from '@/components/cv/cv-tailor-modal';
import EmailReviewModal from '@/components/email/email-review-modal';
import CoverLetterModal from '@/components/cv/cover-letter-modal';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [education, setEducation] = useState('ALL');
  const [experience, setExperience] = useState('ALL');
  const [sector, setSector] = useState('ALL');
  const [urgency, setUrgency] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [myProfileMatch, setMyProfileMatch] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);

  // Modals state
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<any | null>(null);
  const [selectedJobForTailor, setSelectedJobForTailor] = useState<any | null>(null);
  const [selectedJobForEmail, setSelectedJobForEmail] = useState<any | null>(null);
  const [selectedJobForCoverLetter, setSelectedJobForCoverLetter] = useState<any | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [category, education, experience, sector, urgency, minSalary, myProfileMatch]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'ALL') params.set('category', category);
      if (education !== 'ALL') params.set('education', education);
      if (experience !== 'ALL') params.set('experience', experience);
      if (sector !== 'ALL') params.set('sector', sector);
      if (urgency) params.set('urgency', urgency);
      if (minSalary) params.set('minSalary', minSalary);
      if (myProfileMatch) params.set('myProfileMatch', 'true');
      if (query.trim()) params.set('q', query.trim());

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDiscovery = async () => {
    setIsDiscovering(true);
    try {
      await fetch('/api/jobs/discover', { method: 'POST' });
      fetchJobs();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchJobs();
  };

  const clearAllFilters = () => {
    setQuery('');
    setCategory('ALL');
    setEducation('ALL');
    setExperience('ALL');
    setSector('ALL');
    setUrgency('');
    setMinSalary('');
    setMyProfileMatch(false);
  };

  const hasActiveFilters =
    query ||
    category !== 'ALL' ||
    education !== 'ALL' ||
    experience !== 'ALL' ||
    sector !== 'ALL' ||
    urgency ||
    minSalary ||
    myProfileMatch;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Opportunity Discovery Engine</span>
            <span className="text-xs font-mono rounded bg-slate-800 text-emerald-400 px-2.5 py-1 border border-slate-700">
              {jobs.length} Verified Circulars
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Scanning direct job posts from Bdjobs, official central bank & government portals, LinkedIn, and multinational management trainee programs.
          </p>
        </div>

        <button
          onClick={handleRunDiscovery}
          disabled={isDiscovering}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/40 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isDiscovering ? 'animate-spin' : ''}`} />
          <span>{isDiscovering ? 'Scanning Live Connectors...' : 'Discover & Refresh Opportunities'}</span>
        </button>
      </div>

      {/* Filter and Query Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-4 shadow-xl">
        {/* Omni-Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by degree (BBA, MBA, CSE, MIS), experience (freshers, 0-1 yr), sector (bank, tech), or skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setTimeout(fetchJobs, 50);
                }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Quick Suggestion Search Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Quick Searches:</span>
          {[
            'BBA MIS Freshers',
            'Bank Jobs',
            'MBA Trainee',
            '0-1 Year Experience',
            'CSE Analyst',
            'Govt Cadre',
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setQuery(tag);
                setTimeout(fetchJobs, 50);
              }}
              className="rounded-md bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 px-2 py-0.5 border border-slate-700/60 transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 1-Click Quick Preset Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          {/* Smart "Match My Profile" Button */}
          <button
            onClick={() => {
              setMyProfileMatch(!myProfileMatch);
              if (!myProfileMatch) {
                setEducation('ALL');
                setExperience('ALL');
                setCategory('ALL');
              }
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition border shadow-sm ${
              myProfileMatch
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-emerald-950/60 text-emerald-400 border-emerald-600/50 hover:bg-emerald-900/60'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>★ Match My Profile (BBA MIS 0-1yr)</span>
          </button>

          {/* Preset Buttons */}
          <button
            onClick={() => {
              setExperience(experience === 'FRESHER' ? 'ALL' : 'FRESHER');
              setMyProfileMatch(false);
            }}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition border ${
              experience === 'FRESHER'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            🎓 Freshers (0-1 yr)
          </button>

          <button
            onClick={() => {
              setSector(sector === 'BANKING' ? 'ALL' : 'BANKING');
              setMyProfileMatch(false);
            }}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition border ${
              sector === 'BANKING'
                ? 'bg-sky-600 text-white border-sky-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            🏛️ Bank Jobs
          </button>

          <button
            onClick={() => {
              setEducation(education === 'BBA' ? 'ALL' : 'BBA');
              setMyProfileMatch(false);
            }}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition border ${
              education === 'BBA'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            📊 BBA / MIS
          </button>

          <button
            onClick={() => {
              setEducation(education === 'MBA' ? 'ALL' : 'MBA');
              setMyProfileMatch(false);
            }}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition border ${
              education === 'MBA'
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            🎓 MBA
          </button>

          <button
            onClick={() => {
              setEducation(education === 'CSE' ? 'ALL' : 'CSE');
              setMyProfileMatch(false);
            }}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition border ${
              education === 'CSE'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            💻 CSE / Tech
          </button>

          <button
            onClick={() => {
              setCategory(category === 'TRAINEE' ? 'ALL' : 'TRAINEE');
              setMyProfileMatch(false);
            }}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition border ${
              category === 'TRAINEE'
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            🚀 Trainee / MTO
          </button>

          <button
            onClick={() => {
              setCategory(category === 'GOVERNMENT' ? 'ALL' : 'GOVERNMENT');
              setMyProfileMatch(false);
            }}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition border ${
              category === 'GOVERNMENT'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            🏛️ Govt Circulars
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Detailed Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2 border-t border-slate-800/60">
          {/* Degree Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Required Degree
            </label>
            <select
              value={education}
              onChange={(e) => {
                setEducation(e.target.value);
                setMyProfileMatch(false);
              }}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="ALL">All Degrees</option>
              <option value="BBA">BBA (Business Admin)</option>
              <option value="MIS">MIS / Information Systems</option>
              <option value="MBA">MBA / Master's</option>
              <option value="CSE">CSE / IT / Software</option>
              <option value="GRADUATION">Any Bachelor / Honors</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => {
                setExperience(e.target.value);
                setMyProfileMatch(false);
              }}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="ALL">Any Experience</option>
              <option value="FRESHER">Freshers (0-1 yr)</option>
              <option value="1_3">1 to 3 Years</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Industry / Sector
            </label>
            <select
              value={sector}
              onChange={(e) => {
                setSector(e.target.value);
                setMyProfileMatch(false);
              }}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="ALL">All Sectors</option>
              <option value="BANKING">Banking & Financial</option>
              <option value="TECH">Software & Tech</option>
              <option value="FMCG">FMCG & Corporate MNC</option>
              <option value="GOVERNMENT">Government & Public</option>
              <option value="PRIVATE">Private Sector</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Deadline Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Deadlines</option>
              <option value="URGENT">Urgent (&lt; 24h)</option>
              <option value="HIGH">High (2-3 days)</option>
              <option value="MEDIUM">Medium (4-7 days)</option>
              <option value="NORMAL">Normal (&gt; 7 days)</option>
            </select>
          </div>

          {/* Min Salary Filter */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Min Monthly Salary
            </label>
            <select
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Any Salary</option>
              <option value="25000">&ge; 25,000 BDT</option>
              <option value="40000">&ge; 40,000 BDT</option>
              <option value="55000">&ge; 55,000 BDT</option>
              <option value="75000">&ge; 75,000 BDT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400">Loading verified opportunities and matching analysis...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-16 text-center space-y-3">
          <p className="text-slate-300 font-semibold text-base">No opportunities match the selected criteria.</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try broadening your degree or experience filters, or click "Reset Filters" to view all available circulars.
          </p>
          <button
            onClick={clearAllFilters}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpenDetails={(j) => setSelectedJobForDetail(j)}
              onTailorCV={(j) => setSelectedJobForTailor(j)}
              onPrepareEmail={(j) => setSelectedJobForEmail(j)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          onClose={() => setSelectedJobForDetail(null)}
          onTailorCV={(j) => {
            setSelectedJobForDetail(null);
            setSelectedJobForTailor(j);
          }}
          onPrepareEmail={(j) => {
            setSelectedJobForDetail(null);
            setSelectedJobForEmail(j);
          }}
          onGenerateCoverLetter={(j) => {
            setSelectedJobForDetail(null);
            setSelectedJobForCoverLetter(j);
          }}
        />
      )}

      {selectedJobForTailor && (
        <CVTailorModal
          job={selectedJobForTailor}
          onClose={() => setSelectedJobForTailor(null)}
          onSuccess={() => {
            setSelectedJobForTailor(null);
            fetchJobs();
          }}
        />
      )}

      {selectedJobForEmail && (
        <EmailReviewModal
          job={selectedJobForEmail}
          onClose={() => setSelectedJobForEmail(null)}
          onApplicationUpdated={() => {
            setSelectedJobForEmail(null);
            fetchJobs();
          }}
        />
      )}

      {selectedJobForCoverLetter && (
        <CoverLetterModal
          job={selectedJobForCoverLetter}
          onClose={() => setSelectedJobForCoverLetter(null)}
        />
      )}
    </div>
  );
}
