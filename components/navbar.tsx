'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Layers,
  FileText,
  User,
  Bell,
  Sparkles,
  RefreshCw,
  Compass,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [digest, setDigest] = useState<any | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDigest, setShowDigest] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setDigest(data.digest || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncDiscovery = async () => {
    setIsSyncing(true);
    setSyncMessage('Scanning connectors: Bdjobs, LinkedIn, Govt circulars...');
    try {
      const res = await fetch('/api/jobs/discover', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSyncMessage(`Synced ${data.totalDiscovered} opportunities!`);
        fetchNotifications();
        setTimeout(() => setSyncMessage(''), 4000);
      }
    } catch (e) {
      setSyncMessage('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/', icon: Layers },
    { label: 'Discovered Jobs', href: '/jobs', icon: Briefcase },
    { label: 'CV Studio', href: '/cv', icon: FileText },
    { label: 'Applications', href: '/applications', icon: CheckCircle2 },
    { label: 'Career Profile', href: '/profile', icon: User },
    { label: 'Upload CV', href: '/onboarding', icon: Sparkles },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                  CareerPilot <span className="text-emerald-400">AI</span>
                </span>
                <span className="hidden text-[10px] text-slate-400 font-mono sm:inline-block ml-2 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                  BD & Global Agent
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Alerts */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Run Discovery Button */}
            <button
              onClick={handleSyncDiscovery}
              disabled={isSyncing}
              title="Sync & Discover Latest Jobs"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Scan Jobs'}</span>
            </button>

            {/* Daily Digest Modal Trigger */}
            <button
              onClick={() => setShowDigest(true)}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-all"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Daily Digest</span>
            </button>

            {/* Notifications Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-950">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Live Agent Alerts ({notifications.length})
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 text-center">No active notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 text-xs hover:border-slate-700 transition"
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-200">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-500">Just now</span>
                          </div>
                          <p className="mt-1 text-slate-400">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sync notification banner */}
        {syncMessage && (
          <div className="bg-emerald-500/10 border-t border-emerald-500/20 px-4 py-1.5 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{syncMessage}</span>
          </div>
        )}
      </header>

      {/* Daily Digest Modal */}
      {showDigest && digest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Your Daily Career Digest</h3>
              </div>
              <button
                onClick={() => setShowDigest(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
                <span className="text-2xl font-bold text-white">{digest.totalJobsFound}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Discovered</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
                <span className="text-2xl font-bold text-emerald-400">{digest.highlyMatchedCount}</span>
                <p className="text-[11px] text-emerald-300 mt-0.5">High Match</p>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-center">
                <span className="text-2xl font-bold text-blue-400">{digest.governmentJobsCount}</span>
                <p className="text-[11px] text-blue-300 mt-0.5">Govt Circulars</p>
              </div>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-center">
                <span className="text-2xl font-bold text-rose-400">{digest.deadlinesWithin48Hours}</span>
                <p className="text-[11px] text-rose-300 mt-0.5">Urgent &lt;48h</p>
              </div>
            </div>

            {digest.topRecommendation && (
              <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                  Top Recommended Opportunity Today
                </span>
                <div className="mt-1 flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">
                      {digest.topRecommendation.title}
                    </h4>
                    <p className="text-xs text-indigo-200 mt-0.5">
                      {digest.topRecommendation.company}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                    {digest.topRecommendation.matchScore}% Match
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-indigo-500/20 text-xs">
                  <span className="text-indigo-200">
                    Deadline: {new Date(digest.topRecommendation.deadline).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/jobs/${digest.topRecommendation.jobId}`}
                    onClick={() => setShowDigest(false)}
                    className="font-semibold text-white underline hover:text-emerald-300"
                  >
                    Inspect & Tailor &rarr;
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDigest(false)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
              >
                Close Digest
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
