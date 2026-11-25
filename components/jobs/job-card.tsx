'use client';

import React from 'react';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  FileText,
  Mail,
  Landmark,
  GraduationCap,
  Globe,
  ShieldCheck
} from 'lucide-react';

interface JobCardProps {
  job: any;
  onOpenDetails: (job: any) => void;
  onTailorCV: (job: any) => void;
  onPrepareEmail: (job: any) => void;
}

export default function JobCard({
  job,
  onOpenDetails,
  onTailorCV,
  onPrepareEmail,
}: JobCardProps) {
  const match = job.match;
  const score = match?.overallScore || 75;

  const isUrgent = job.urgencyLevel === 'URGENT';
  const isHigh = job.urgencyLevel === 'HIGH';

  const isGovt = job.jobType === 'GOVERNMENT';
  const isIntern = job.jobType === 'INTERNSHIP' || job.jobType === 'TRAINEE';

  return (
    <div
      className={`group relative rounded-2xl border bg-slate-900/90 p-5 transition-all duration-200 hover:border-slate-700 hover:shadow-xl hover:shadow-slate-950/50 flex flex-col justify-between ${
        isUrgent
          ? 'border-rose-500/40 ring-1 ring-rose-500/20'
          : isGovt
          ? 'border-blue-500/30 ring-1 ring-blue-500/10'
          : 'border-slate-800'
      }`}
    >
      <div>
        {/* Badges Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Job Type Badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                isGovt
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : isIntern
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {isGovt ? <Landmark className="h-3 w-3" /> : isIntern ? <GraduationCap className="h-3 w-3" /> : <Building className="h-3 w-3" />}
              {job.jobType}
            </span>

            {/* Clickable Verified Direct Job Post Badge */}
            <a
              href={job.sourceUrl || job.applicationUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 bg-sky-950/80 border border-sky-800 hover:bg-sky-900/80 hover:text-sky-200 px-2.5 py-0.5 rounded-md transition shadow-xs"
              title={`Direct verified link to this specific circular on ${job.source}`}
            >
              <Globe className="h-3 w-3 text-sky-400" />
              <span>Direct Post: {job.source}</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-70" />
            </a>

            {/* Remote status */}
            <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              {job.remoteType}
            </span>
          </div>

          {/* Match Score Badge */}
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                score >= 90
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : score >= 80
                  ? 'bg-teal-500/15 text-teal-400 border-teal-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>{score}% Match</span>
            </div>
          </div>
        </div>

        {/* Title & Company */}
        <h3
          onClick={() => onOpenDetails(job)}
          className="text-base sm:text-lg font-bold text-white hover:text-emerald-400 cursor-pointer transition line-clamp-1"
        >
          {job.title}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
          <span className="font-semibold text-slate-200">{job.company}</span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-400 truncate">
            <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
            {job.location}
          </span>
        </div>

        {/* Education & Experience Highlight Pills */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded bg-slate-800/90 px-2 py-0.5 text-slate-300 border border-slate-700/80">
            <GraduationCap className="h-3 w-3 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[190px]" title={job.educationRequirements}>{job.educationRequirements}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-slate-800/90 px-2 py-0.5 text-slate-300 border border-slate-700/80">
            <Clock className="h-3 w-3 text-amber-400 shrink-0" />
            <span className="truncate max-w-[140px]" title={job.experienceRequirements}>{job.experienceRequirements}</span>
          </span>
        </div>

        {/* Compensation & Urgency */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs border-y border-slate-800/80 py-2.5">
          <div className="font-medium text-emerald-400">
            {job.salary || 'Salary Negotiable'}
          </div>

          {/* Urgency Badge */}
          <div
            className={`flex items-center gap-1 font-semibold text-[11px] ${
              isUrgent
                ? 'text-rose-400'
                : isHigh
                ? 'text-amber-400'
                : 'text-slate-400'
            }`}
          >
            <Clock className="h-3 w-3 shrink-0" />
            <span>
              {isUrgent
                ? 'Urgent: <24h Left'
                : isHigh
                ? '2-3 Days Left'
                : `Deadline: ${new Date(job.applicationDeadline).toLocaleDateString()}`}
            </span>
          </div>
        </div>

        {/* Eligibility & Grounded Match Preview */}
        <div className="mt-3 space-y-1.5">
          {/* Eligibility Pill */}
          {match?.eligibilityStatus && (
            <div className="flex items-center gap-1 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-medium text-slate-300">
                <strong className="text-emerald-400">Eligibility:</strong> {match.eligibilityStatus}
              </span>
            </div>
          )}

          {/* Top grounded reason */}
          {match?.matchReasons?.[0] && (
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pl-1 border-l-2 border-slate-700">
              {match.matchReasons[0]}
            </p>
          )}

          {/* Government Circular Special Note */}
          {isGovt && job.governmentCircular && (
            <div className="mt-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-2 text-[11px] text-blue-200 flex items-center justify-between">
              <span>Vacancies: <strong>{job.governmentCircular.vacancies} Posts</strong></span>
              <span>Fee: {job.governmentCircular.applicationFee}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetails(job)}
          className="text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1"
        >
          View Analysis & Circular
        </button>

        <div className="flex items-center gap-2">
          {/* Tailor CV Button - High Priority Distinct Styling */}
          <button
            onClick={() => onTailorCV(job)}
            title="Open Overleaf ATS Resume Editor tailored for this role"
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/60 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition shadow-sm ring-1 ring-emerald-500/20"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            <span>Tailor & View CV</span>
          </button>

          {/* Apply / Email Dispatch */}
          {job.applicationMethod === 'EMAIL' ? (
            <button
              onClick={() => onPrepareEmail(job)}
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm shadow-emerald-900/40"
            >
              <Mail className="h-3 w-3" />
              <span>Email Draft</span>
            </button>
          ) : (
            <a
              href={job.applicationUrl || job.sourceUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
              title="Opens external official website"
            >
              <span>Apply (Portal)</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
