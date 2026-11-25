'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Sparkles,
  Clock,
  Send,
  Calendar,
  Award,
  AlertTriangle,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  Landmark,
  GraduationCap
} from 'lucide-react';
import JobCard from '@/components/jobs/job-card';
import JobDetailModal from '@/components/jobs/job-detail-modal';
import CVTailorModal from '@/components/cv/cv-tailor-modal';
import EmailReviewModal from '@/components/email/email-review-modal';
import CoverLetterModal from '@/components/cv/cover-letter-modal';

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stats, setStats] = useState({
    newJobs: 0,
    highMatch: 0,
    deadlineSoon: 0,
    applied: 0,
    interviews: 0,
    offers: 0,
  });

  // Modals state
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<any | null>(null);
  const [selectedJobForTailor, setSelectedJobForTailor] = useState<any | null>(null);
  const [selectedJobForEmail, setSelectedJobForEmail] = useState<any | null>(null);
  const [selectedJobForCoverLetter, setSelectedJobForCoverLetter] = useState<any | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [selectedCategory, searchQuery]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Jobs
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
      if (searchQuery) params.set('q', searchQuery);

      const jobsRes = await fetch(`/api/jobs?${params.toString()}`);
      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setJobs(data.jobs || []);

        // Calculate statistics
        const allJobs = data.jobs || [];
        const highMatch = allJobs.filter((j: any) => (j.match?.overallScore || 0) >= 85).length;
        const deadlineSoon = allJobs.filter(
          (j: any) => j.urgencyLevel === 'URGENT' || j.urgencyLevel === 'HIGH'
        ).length;

        // 2. Fetch applications for application counts
        const appsRes = await fetch('/api/applications');
        let appliedCount = 0;
        let interviewCount = 0;
        let offerCount = 0;
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          const apps = appsData.applications || [];
          appliedCount = apps.filter((a: any) => a.status === 'APPLIED').length;
          interviewCount = apps.filter((a: any) => a.status === 'INTERVIEW').length;
          offerCount = apps.filter((a: any) => a.status === 'OFFER').length;
        }

        setStats({
          newJobs: allJobs.length,
          highMatch,
          deadlineSoon,
          applied: appliedCount,
          interviews: interviewCount,
          offers: offerCount,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Find urgent job if any
  const urgentJob = jobs.find((j) => j.urgencyLevel === 'URGENT');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>Autonomous AI Job Hunting Engine</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="text-emerald-400">Prince</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Profile: BBA Graduate (East West University) • 0-1 yr exp • Target: Business Analyst & Data Analytics in Dhaka
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            <span>Upload New CV</span>
          </Link>
          <Link
            href="/applications"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/50"
          >
            <span>View Application Tracker</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Urgent Deadline Alert Banner */}
      {urgentJob && (
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 p-4 sm:p-5 ring-1 ring-rose-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40">
                <AlertTriangle className="h-5 w-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30">
                    Urgent Deadline (&lt;24h)
                  </span>
                  <span className="text-xs text-rose-200 font-semibold">{urgentJob.company}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {urgentJob.title} — {urgentJob.match?.overallScore}% Match
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <button
                onClick={() => setSelectedJobForDetail(urgentJob)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
              >
                Inspect
              </button>
              <button
                onClick={() => setSelectedJobForEmail(urgentJob)}
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 transition shadow-md shadow-rose-950/40"
              >
                Review & Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top 6 Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">New Jobs</span>
            <Briefcase className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.newJobs}</p>
          <span className="text-[10px] text-slate-500">BD & Global Sources</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 ring-1 ring-emerald-500/10">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold">Highly Matched</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-400">{stats.highMatch}</p>
          <span className="text-[10px] text-emerald-500/80">&ge; 85% Suitability</span>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 ring-1 ring-amber-500/10">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold">Deadline Soon</span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-400">{stats.deadlineSoon}</p>
          <span className="text-[10px] text-amber-500/80">Expiring in &lt;3 days</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Applications Sent</span>
            <Send className="h-4 w-4 text-blue-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.applied}</p>
          <span className="text-[10px] text-slate-500">Tracked in system</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Interviews</span>
            <Calendar className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.interviews}</p>
          <span className="text-[10px] text-slate-500">Pipeline active</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Offers</span>
            <Award className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.offers}</p>
          <span className="text-[10px] text-slate-500">Ready to negotiate</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
            {[
              { id: 'ALL', label: 'All Opportunities' },
              { id: 'RECOMMENDED', label: '★ Recommended (85%+)' },
              { id: 'PRIVATE', label: 'Private Sector' },
              { id: 'GOVERNMENT', label: 'Govt Circulars' },
              { id: 'INTERNSHIP', label: 'Internships' },
              { id: 'TRAINEE', label: 'Graduate Trainee' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search title, skills, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Opportunities Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Discovered &amp; Ranked Opportunities</span>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
                {jobs.length} Found
              </span>
            </h2>
            <span className="text-xs text-slate-500">Sorted by Match Score &amp; Deadline Urgency</span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
              <p className="text-sm text-slate-400">
                Evaluating candidate eligibility and calculating multi-dimensional match scores...
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 py-16 text-center space-y-3">
              <p className="text-slate-400 text-sm">No opportunities match the current filter query.</p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-emerald-400 underline hover:text-emerald-300"
              >
                Reset Filters
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
        </div>
      </div>

      {/* MODALS */}
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
          onSaveJob={() => loadDashboardData()}
        />
      )}

      {selectedJobForTailor && (
        <CVTailorModal
          job={selectedJobForTailor}
          onClose={() => setSelectedJobForTailor(null)}
          onSuccess={() => loadDashboardData()}
        />
      )}

      {selectedJobForEmail && (
        <EmailReviewModal
          job={selectedJobForEmail}
          onClose={() => setSelectedJobForEmail(null)}
          onApplicationUpdated={() => loadDashboardData()}
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
