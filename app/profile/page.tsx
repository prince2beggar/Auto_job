'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Save,
  Edit,
  ExternalLink,
  FileCode,
  Copy,
  Check,
  Download
} from 'lucide-react';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any | null>(null);
  const [masterLatex, setMasterLatex] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'MASTER_CV' | 'PREFERENCES'>('PROFILE');
  const [masterCvView, setMasterCvView] = useState<'LATEX' | 'TEXT'>('LATEX');
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfileData(data.profile);
        setMasterLatex(data.masterLatex || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
        <p className="text-sm text-slate-400">Loading your verified career profile and Master CV...</p>
      </div>
    );
  }

  const masterCv = profileData?.masterCvs?.[0];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Career Profile &amp; Master CV</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Authoritative candidate profile, truth provenance flags, and Master CV versioning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2">
            <span className="text-xs text-slate-400">Completion:</span>
            <span className="text-sm font-bold text-emerald-400">
              {profileData?.completionPercentage || 88}%
            </span>
          </div>

          <button
            onClick={handleUpdate}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-950/40 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Missing Fields Notice if < 100% */}
      {profileData?.missingFields && profileData.missingFields.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-xs text-amber-300">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Profile Recommendations:</span>
            <span>
              Your profile is {profileData.completionPercentage}% complete. Consider adding:{' '}
              <strong>{profileData.missingFields.join(', ')}</strong> to improve match accuracy.
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        {[
          { id: 'PROFILE', label: 'Candidate Profile', icon: User },
          { id: 'MASTER_CV', label: 'Master CV (Original)', icon: FileText },
          { id: 'PREFERENCES', label: 'Job & Salary Preferences', icon: Briefcase },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE DETAILS */}
      {activeTab === 'PROFILE' && (
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileData.phone || ''}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">City / Location</label>
                <input
                  type="text"
                  value={profileData.city || 'Dhaka'}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={profileData.linkedin || ''}
                  onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">GitHub / Portfolio</label>
                <input
                  type="text"
                  value={profileData.github || ''}
                  onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Professional Bio / Summary</label>
              <textarea
                rows={3}
                value={profileData.bio || ''}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Education list */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Education Records</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Verified Degrees
              </span>
            </h3>

            {profileData.educations?.map((edu: any) => (
              <div key={edu.id} className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{edu.degree}</h4>
                  <span className="text-xs text-emerald-400 font-semibold">CGPA {edu.cgpa}</span>
                </div>
                <p className="text-xs text-slate-300">
                  {edu.institution} • Major: {edu.major} • Class of {edu.graduationYear}
                </p>
              </div>
            ))}
          </div>

          {/* Experience list */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Work &amp; Internship History
            </h3>

            {profileData.experiences?.map((exp: any) => (
              <div key={exp.id} className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">
                    {exp.jobTitle} &mdash; <span className="text-slate-300">{exp.company}</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {JSON.parse(exp.technologies || '[]').map((tech: string, i: number) => (
                    <span key={i} className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Verified Skills Inventory ({profileData.skills?.length})
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {profileData.skills?.map((sk: any) => (
                <span
                  key={sk.id}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200"
                >
                  {sk.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER CV */}
      {activeTab === 'MASTER_CV' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Stored Master CV &amp; Overleaf LaTeX Source</h3>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    Overleaf Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Template: <strong>ATS-Friendly One-Page Resume (MD ASADUJJAMAN PRINCE)</strong>
                </p>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setMasterCvView('LATEX')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                    masterCvView === 'LATEX'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="h-3 w-3 text-[#B8972A]" />
                  <span>Overleaf LaTeX</span>
                </button>
                <button
                  onClick={() => setMasterCvView('TEXT')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition ${
                    masterCvView === 'TEXT'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  <span>Extracted Text</span>
                </button>
              </div>
            </div>

            {masterCvView === 'LATEX' ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-xs">
                  <span className="text-slate-400">
                    This LaTeX source matches your exact Overleaf styling with custom colors and commands.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        if (!masterLatex) return;
                        await navigator.clipboard.writeText(masterLatex);
                        setCopiedLatex(true);
                        setTimeout(() => setCopiedLatex(false), 2500);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 font-semibold transition"
                    >
                      {copiedLatex ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy LaTeX</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (!masterLatex) return;
                        const blob = new Blob([masterLatex], { type: 'text/x-tex;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'MD_ASADUJJAMAN_PRINCE_MASTER_CV.tex';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-semibold transition shadow"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download .tex</span>
                    </button>

                    <a
                      href="https://www.overleaf.com/project"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:text-white font-semibold transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Overleaf</span>
                    </a>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#0d1117] p-4">
                  <pre className="text-xs text-emerald-300/90 font-mono whitespace-pre leading-relaxed max-h-[55vh] overflow-y-auto overflow-x-auto">
                    {masterLatex || 'Generating Overleaf LaTeX code...'}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Raw Extracted Master CV Text
                </span>
                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto">
                  {masterCv?.rawText || 'No raw CV stored.'}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CAREER PREFERENCES */}
      {activeTab === 'PREFERENCES' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Target Roles, Locations &amp; Salary Expectations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Target Titles:</span>
              <p className="font-semibold text-white">
                {JSON.parse(profileData.careerPreferences?.targetTitles || '[]').join(', ')}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Preferred Job Types:</span>
              <p className="font-semibold text-white">
                {JSON.parse(profileData.careerPreferences?.jobTypes || '[]').join(', ')}
              </p>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Locations:</span>
              <p className="font-semibold text-white">
                {JSON.parse(profileData.careerPreferences?.locations || '[]').join(', ')} (
                {profileData.careerPreferences?.remotePreference})
              </p>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Minimum Desired Salary:</span>
              <p className="font-bold text-emerald-400">
                {profileData.careerPreferences?.minSalary?.toLocaleString()}{' '}
                {profileData.careerPreferences?.currency} / month
              </p>
            </div>
          </div>

          {profileData.careerPreferences?.naturalLanguageGoal && (
            <div className="pt-3 border-t border-slate-800">
              <span className="text-slate-400 block mb-1 text-xs">Original Goal Expression:</span>
              <p className="text-xs text-slate-300 italic bg-slate-950 p-3 rounded-lg border border-slate-800">
                "{profileData.careerPreferences.naturalLanguageGoal}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
