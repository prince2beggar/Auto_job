'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  MapPin,
  Clock,
  ExternalLink,
  FileText,
  Mail,
  Landmark,
  ShieldCheck,
  Bookmark,
  Check,
  Globe
} from 'lucide-react';

interface JobDetailModalProps {
  job: any;
  onClose: () => void;
  onTailorCV: (job: any) => void;
  onPrepareEmail: (job: any) => void;
  onGenerateCoverLetter: (job: any) => void;
  onSaveJob?: (job: any) => void;
}

export default function JobDetailModal({
  job,
  onClose,
  onTailorCV,
  onPrepareEmail,
  onGenerateCoverLetter,
  onSaveJob,
}: JobDetailModalProps) {
  const [isSaved, setIsSaved] = useState(false);

  const match = job.match;
  const isGovt = job.jobType === 'GOVERNMENT';
  const circ = job.governmentCircular;

  const handleSave = async () => {
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, status: 'SAVED' }),
      });
      setIsSaved(true);
      if (onSaveJob) onSaveJob(job);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 p-6 bg-slate-950/60">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                {job.jobType}
              </span>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300 border border-slate-700">
                Source: {job.source}
              </span>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300 border border-slate-700">
                {job.remoteType}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{job.title}</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-slate-200">{job.company}</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">{job.salary || 'Salary Negotiable'}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Job Source & Circular Verification Card */}
          <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-4 ring-1 ring-sky-500/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                      Authentic Circular Source
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-500/30">
                      <ShieldCheck className="h-3 w-3 text-sky-400" />
                      Direct Verified Post
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {job.source} • {job.company}
                  </h4>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                    <span className="text-emerald-400 font-semibold">Degree:</span> {job.educationRequirements}
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">Exp:</span> {job.experienceRequirements}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate max-w-sm sm:max-w-md">
                    Direct Post URL: <span className="font-mono text-sky-300">{job.sourceUrl || job.applicationUrl}</span>
                  </p>
                </div>
              </div>

              <a
                href={job.sourceUrl || job.applicationUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 px-3.5 py-2 text-xs font-bold text-sky-200 transition shadow-sm"
              >
                <span>Open Direct Job Circular</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* AI Intelligence & Match Breakdown Box */}
          {match && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 ring-1 ring-emerald-500/20">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-lg font-bold">
                    {match.overallScore}%
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Overall Suitability Score
                    </span>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Eligibility: {match.eligibilityStatus}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </h4>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-300">
                  <span className="text-slate-400">Deadline:</span>{' '}
                  <strong className="text-white">
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              {/* Granular Dimension Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4 text-center">
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                  <span className="text-lg font-bold text-emerald-400">{match.educationScore}%</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Education</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                  <span className="text-lg font-bold text-emerald-400">{match.experienceScore}%</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Experience</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                  <span className="text-lg font-bold text-emerald-400">{match.skillsScore}%</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Skills Match</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                  <span className="text-lg font-bold text-emerald-400">{match.roleScore}%</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Role Fit</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                  <span className="text-lg font-bold text-emerald-400">{match.locationScore}%</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Location</p>
                </div>
              </div>

              {/* Grounded Explanation: Why This Job Matches You */}
              <div className="mt-4 pt-3 border-t border-emerald-500/20">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
                  Why This Opportunity Matches Your Profile
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {match.matchReasons.map((reason: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Government Circular Special Panel */}
          {isGovt && circ && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 ring-1 ring-blue-500/20 space-y-4">
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-blue-400" />
                  <h4 className="font-bold text-white text-base">Official Government Circular Specifications</h4>
                </div>
                <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-500/30">
                  Vacancies: {circ.vacancies} Posts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Recruiting Ministry / Division:</span>
                  <span className="font-semibold text-white">{circ.ministry}</span>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Post Designation:</span>
                  <span className="font-semibold text-white">{circ.postTitle}</span>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Age Limits:</span>
                  <span className="font-semibold text-white">{circ.ageLimit}</span>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Application Fee & Payment:</span>
                  <span className="font-semibold text-white">{circ.applicationFee} via {circ.paymentMethod}</span>
                </div>
              </div>

              {/* Exam Stages */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Recruitment Exam Stages
                </span>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>1. Preliminary Screening:</span>
                    <strong className="text-slate-100">{circ.preliminaryExam || 'MCQ Screening'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. Written Test:</span>
                    <strong className="text-slate-100">{circ.writtenExam || 'Subjective Exam'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. Viva Voce:</span>
                    <strong className="text-slate-100">{circ.vivaExam || 'Oral Interview'}</strong>
                  </div>
                </div>
              </div>

              {circ.circularPdfUrl && (
                <div className="flex justify-end pt-1">
                  <a
                    href={circ.circularPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
                  >
                    <span>View Official Circular PDF Notice</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Job Description & Responsibilities */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">About the Position</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Core Responsibilities</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {job.responsibilities.map((resp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications & Skills */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">Required Qualifications & Skills</h4>
            <div className="text-xs text-slate-300 space-y-1">
              <p><strong>Education:</strong> {job.educationRequirements}</p>
              <p><strong>Experience:</strong> {job.experienceRequirements}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {job.requiredSkills.map((sk: string, idx: number) => (
                <span
                  key={idx}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 p-6 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaved}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              {isSaved ? <Check className="h-4 w-4 text-emerald-400" /> : <Bookmark className="h-4 w-4" />}
              <span>{isSaved ? 'Job Saved' : 'Save Job'}</span>
            </button>

            <button
              onClick={() => onGenerateCoverLetter(job)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>Cover Letter</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onTailorCV(job)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/60 bg-emerald-950/60 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 transition ring-1 ring-emerald-500/30 shadow-md"
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>Tailor & Edit Overleaf CV</span>
            </button>

            {job.applicationMethod === 'EMAIL' ? (
              <button
                onClick={() => onPrepareEmail(job)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-900/30"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Prepare Email Application</span>
              </button>
            ) : (
              <a
                href={job.applicationUrl || job.sourceUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-900/30"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
