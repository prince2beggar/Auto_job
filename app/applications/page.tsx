'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Send,
  Calendar,
  AlertCircle,
  FileText,
  Building,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  History,
  X
} from 'lucide-react';

const STATUS_COLUMNS = [
  { id: 'SAVED', label: 'Saved Opportunities', color: 'border-slate-700 bg-slate-800/40 text-slate-300' },
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
  { id: 'CV_GENERATED', label: 'CV Tailored', color: 'border-teal-500/30 bg-teal-500/10 text-teal-300' },
  { id: 'READY_TO_APPLY', label: 'Ready to Dispatch', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  { id: 'APPLIED', label: 'Applied', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
  { id: 'UNDER_REVIEW', label: 'Under Review', color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300' },
  { id: 'INTERVIEW', label: 'Interview Stage', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' },
  { id: 'OFFER', label: 'Offers Received', color: 'border-emerald-400 bg-emerald-500/20 text-emerald-200' },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppForTimeline, setSelectedAppForTimeline] = useState<any | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          status: newStatus,
          eventTitle: `Transitioned to ${newStatus.replace(/_/g, ' ')}`,
          eventDescription: `Status manually moved to ${newStatus.replace(/_/g, ' ')}.`,
        }),
      });
      fetchApplications();
      if (selectedAppForTimeline && selectedAppForTimeline.job.id === jobId) {
        setSelectedAppForTimeline((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Application Journey Tracker</span>
            <span className="text-xs font-mono rounded bg-slate-800 text-emerald-400 px-2.5 py-1 border border-slate-700">
              {applications.length} Active Tracks
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Lifecycle stages, chronological application events, and recruiter reply tracking.
          </p>
        </div>

        <Link
          href="/"
          className="self-start md:self-center flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition border border-slate-700"
        >
          <span>&larr; Back to Dashboard</span>
        </Link>
      </div>

      {/* Kanban Board / Pipeline Columns */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400">Loading your active application pipeline...</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px]">
            {STATUS_COLUMNS.map((col) => {
              const colApps = applications.filter((a) => a.status === col.id);
              return (
                <div
                  key={col.id}
                  className="w-72 shrink-0 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 flex flex-col justify-between space-y-3"
                >
                  {/* Column Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-xs font-bold text-slate-200">{col.label}</span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-400">
                        {colApps.length}
                      </span>
                    </div>

                    {/* Applications Cards */}
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      {colApps.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-800/80 p-4 text-center text-slate-600 text-xs">
                          No applications
                        </div>
                      ) : (
                        colApps.map((app) => (
                          <div
                            key={app.id}
                            className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2 hover:border-slate-700 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-white hover:text-emerald-400 transition line-clamp-1">
                                {app.job.title}
                              </h4>
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 shrink-0">
                                {app.job.matchScore}%
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <Building className="h-3 w-3 shrink-0" />
                              <span className="truncate">{app.job.company}</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                              <span>{app.applicationMethod}</span>
                              <button
                                onClick={() => setSelectedAppForTimeline(app)}
                                className="font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                              >
                                <span>Timeline ({app.events.length})</span>
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Move stage dropdown */}
                            <div className="pt-1">
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app.job.id, e.target.value)}
                                className="w-full rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 py-1 px-1.5 focus:outline-none focus:border-emerald-500"
                              >
                                {STATUS_COLUMNS.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    Move &rarr; {c.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* APPLICATION TIMELINE DRAWER / MODAL */}
      {selectedAppForTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Application Journey Timeline</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedAppForTimeline.job.title} at <strong>{selectedAppForTimeline.job.company}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedAppForTimeline(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Timeline Events List */}
            <div className="mt-5 max-h-[60vh] overflow-y-auto space-y-4 pr-1">
              {selectedAppForTimeline.events.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No recorded events yet</p>
              ) : (
                selectedAppForTimeline.events.map((event: any, idx: number) => (
                  <div key={event.id || idx} className="relative pl-6 pb-2 border-l-2 border-slate-800 last:border-transparent">
                    {/* Event Dot */}
                    <div className="absolute -left-[7px] top-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-slate-900"></div>

                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{event.title}</h4>
                      <span className="text-[10px] text-slate-500">
                        {new Date(event.timestamp).toLocaleDateString()}{' '}
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Notes footer */}
            {selectedAppForTimeline.notes && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
                <span className="text-slate-400 block mb-0.5 font-semibold">User Notes:</span>
                {selectedAppForTimeline.notes}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedAppForTimeline(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
