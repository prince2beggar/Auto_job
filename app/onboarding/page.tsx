'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Check,
  RotateCcw,
  FileUp,
  X,
  ClipboardPaste,
  HelpCircle
} from 'lucide-react';

type Step = 'CHOOSE_PATH' | 'UPLOAD_FILE' | 'SCANNING' | 'REVIEW_DRAFT' | 'CONFIRMED';

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<Step>('CHOOSE_PATH');
  const [activeTab, setActiveTab] = useState<'FILE' | 'PASTE'>('FILE');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanStage, setScanStage] = useState(0);

  const scanStages = [
    'Reading document binary & structure...',
    'Extracting education credentials & degree info...',
    'Parsing employment history & internship achievements...',
    'Scanning core technical tools & competencies...',
    'Synthesizing draft profile with provenance flags...',
  ];

  // Natural Language Goal
  const [naturalGoal, setNaturalGoal] = useState(
    'I am looking for Business Analyst, Data Analyst, Business Intelligence, Product, or Marketing entry-level jobs. I am a BBA graduate with 0-1 year experience. I prefer Dhaka or remote jobs and want full-time or internship opportunities with at least 35,000 BDT.'
  );
  const [isParsingGoal, setIsParsingGoal] = useState(false);

  // Editable Draft Profile with Provenance
  const [draftProfile, setDraftProfile] = useState<any>({
    fullName: '',
    email: '',
    phone: '',
    country: 'Bangladesh',
    city: 'Dhaka',
    bio: '',
    yearsOfExperience: 0,
    currentStatus: 'Job Seeking',
    completionPercentage: 80,
    missingFields: [],
    education: [],
    experience: [],
    skills: [],
    projects: [],
    careerPreferences: {
      targetTitles: ['Business Analyst', 'Data Analyst'],
      targetIndustries: ['Technology', 'FinTech', 'Telecommunications'],
      experienceLevel: 'Entry Level (0-1 yrs)',
      jobTypes: ['Full-time', 'Internship'],
      locations: ['Dhaka', 'Remote'],
      remotePreference: 'Flexible',
      minSalary: 35000,
      currency: 'BDT',
      salaryNegotiable: true,
      preferredOrgTypes: ['Private', 'Government', 'MNC', 'Startup'],
    },
    rawCvText: '',
    originalFilename: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);

  // Handle Real File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadError('');
      setStep('UPLOAD_FILE');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setUploadError('');
    }
  };

  // Upload and Parse Real File
  const handleProcessUpload = async () => {
    if (!selectedFile && !pastedText.trim()) {
      setUploadError('Please select a file (PDF, DOCX, TXT) or paste your CV text.');
      return;
    }

    setIsProcessing(true);
    setUploadError('');
    setStep('SCANNING');
    setScanStage(0);

    // Progression timer
    const interval = setInterval(() => {
      setScanStage((prev) => (prev < scanStages.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      let data: any;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const res = await fetch('/api/cv/upload', {
          method: 'POST',
          body: formData,
        });

        data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to process file');
        }
      } else {
        // Process pasted text
        const res = await fetch('/api/cv/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: pastedText, filename: 'Pasted_Resume.txt' }),
        });

        data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to parse text');
        }
      }

      clearInterval(interval);
      setScanStage(scanStages.length - 1);

      const parsedDraft = data.result?.profileDraft || data.result;

      setDraftProfile({
        ...parsedDraft,
        rawCvText: data.rawText || data.result?.rawText || pastedText,
        originalFilename: data.filename || selectedFile?.name || 'Uploaded_Resume.pdf',
      });

      setTimeout(() => {
        setStep('REVIEW_DRAFT');
        setIsProcessing(false);
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setStep('UPLOAD_FILE');
      setUploadError(err.message || 'An error occurred while uploading. Please check the file format.');
    }
  };

  // AI Preference Extractor
  const handleParseGoalWithAI = async () => {
    setIsParsingGoal(true);
    try {
      const res = await fetch('/api/preferences/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalText: naturalGoal }),
      });
      const data = await res.json();
      if (res.ok && data.preferences) {
        setDraftProfile((prev: any) => ({
          ...prev,
          careerPreferences: {
            ...prev.careerPreferences,
            ...data.preferences,
          },
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsingGoal(false);
    }
  };

  // Save Confirmed Profile to Database
  const handleConfirmAndSave = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftProfile),
      });
      if (res.ok) {
        setStep('CONFIRMED');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-8 space-y-8">
      {/* Hidden Real File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,.txt"
        className="hidden"
      />

      {/* STEP 1: CHOOSE ONBOARDING PATH */}
      {step === 'CHOOSE_PATH' && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              Agent Onboarding Wizard
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Build Your Job Hunting Profile
            </h1>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Your AI agent needs to understand your authentic background to discover matching jobs and tailor truthful applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* OPTION B: UPLOAD REAL CV */}
            <div
              onClick={() => {
                setStep('UPLOAD_FILE');
                setTimeout(() => {
                  fileInputRef.current?.click();
                }, 80);
              }}
              className="group cursor-pointer relative rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-950/30 to-slate-900 p-6 sm:p-8 transition-all hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-950/50 flex flex-col justify-between"
            >
              <div className="absolute top-4 right-4 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                FASTEST &bull; RECOMMENDED
              </div>

              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40 group-hover:scale-105 transition">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white group-hover:text-emerald-300 transition">
                  Upload Your CV
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Choose your PDF, DOCX, or text resume. The AI parser extracts your degrees, internship experience, skills, and tools into an editable draft profile.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Select Your File &rarr;</span>
                <span className="text-[11px] text-slate-500 font-normal">Supports PDF / Word</span>
              </div>
            </div>

            {/* OPTION A: MANUAL CREATION */}
            <div
              onClick={() => {
                setDraftProfile({
                  fullName: '',
                  email: '',
                  phone: '',
                  country: 'Bangladesh',
                  city: 'Dhaka',
                  bio: '',
                  yearsOfExperience: 0,
                  currentStatus: 'Job Seeking',
                  completionPercentage: 50,
                  missingFields: ['Education details', 'Core Skills'],
                  education: [
                    {
                      degree: 'Bachelor of Business Administration (BBA)',
                      major: '',
                      institution: '',
                      graduationYear: 2024,
                      cgpa: '',
                      provenance: 'ENTERED',
                    },
                  ],
                  experience: [],
                  skills: [],
                  projects: [],
                  careerPreferences: {
                    targetTitles: ['Business Analyst', 'Data Analyst'],
                    targetIndustries: ['Technology', 'FinTech'],
                    experienceLevel: 'Entry Level (0-1 yrs)',
                    jobTypes: ['Full-time', 'Internship'],
                    locations: ['Dhaka', 'Remote'],
                    remotePreference: 'Flexible',
                    minSalary: 30000,
                    currency: 'BDT',
                    salaryNegotiable: true,
                    preferredOrgTypes: ['Private', 'Government'],
                  },
                });
                setStep('REVIEW_DRAFT');
              }}
              className="group cursor-pointer relative rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 transition-all hover:border-slate-700 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 ring-1 ring-slate-700 group-hover:scale-105 transition">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white group-hover:text-slate-200 transition">
                  Create Manually
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Enter your information step-by-step using structured forms. Specify your degree, past internships, tools, and job preferences manually.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Fill Manual Form &rarr;</span>
                <span className="text-[11px] text-slate-500 font-normal">Self-paced</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: FILE SELECTION / DRAG & DROP ZONE */}
      {step === 'UPLOAD_FILE' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Step 1: Upload Your CV
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">Select Your Resume Document</h2>
            </div>
            <button
              onClick={() => setStep('CHOOSE_PATH')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Back
            </button>
          </div>

          {/* Mode Tabs: File Upload vs Paste Text */}
          <div className="flex items-center gap-2 border-b border-slate-800">
            <button
              onClick={() => setActiveTab('FILE')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition ${
                activeTab === 'FILE'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileUp className="h-4 w-4" />
              <span>Upload Document (PDF / DOCX)</span>
            </button>

            <button
              onClick={() => setActiveTab('PASTE')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition ${
                activeTab === 'PASTE'
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ClipboardPaste className="h-4 w-4" />
              <span>Paste CV Text</span>
            </button>
          </div>

          {uploadError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {activeTab === 'FILE' ? (
            /* Interactive Drag & Drop Box */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 p-10 text-center hover:border-emerald-500 hover:bg-slate-900 transition flex flex-col items-center justify-center space-y-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-emerald-400 ring-1 ring-slate-700 group-hover:scale-105 group-hover:bg-emerald-500/20 transition">
                <UploadCloud className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedFile ? selectedFile.name : 'Click to select your CV or drag and drop'}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {selectedFile
                    ? `File size: ${(selectedFile.size / 1024).toFixed(1)} KB • Ready to extract`
                    : 'Supported formats: PDF, DOCX, DOC, or TXT (Max 10 MB)'}
                </p>
              </div>

              {selectedFile ? (
                <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>File Selected: {selectedFile.name}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                >
                  Browse Device Files
                </button>
              )}
            </div>
          ) : (
            /* Direct Text Paste Option */
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">
                Paste your resume text directly:
              </label>
              <textarea
                rows={12}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the full text of your CV here (Contact, Education, Experience, Skills)..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono leading-relaxed"
              />
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setSelectedFile(null);
                setPastedText('');
                setStep('CHOOSE_PATH');
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleProcessUpload}
              disabled={(!selectedFile && !pastedText.trim()) || isProcessing}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>Extract Profile from CV</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SCANNING LIVE ANIMATION */}
      {step === 'SCANNING' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Extracting Candidate Profile</h2>
            <p className="text-xs text-slate-400">
              Parsing {selectedFile ? selectedFile.name : 'pasted CV text'} with truth-preservation constraints
            </p>
          </div>

          {/* Progress Tracker Checklist */}
          <div className="max-w-md mx-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-left space-y-3">
            {scanStages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-opacity ${
                  idx <= scanStage ? 'opacity-100' : 'opacity-30'
                }`}
              >
                {idx < scanStage ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : idx === scanStage ? (
                  <div className="h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0"></div>
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-700 shrink-0"></div>
                )}
                <span className={idx <= scanStage ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                  {msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW EXTRACTED DRAFT PROFILE */}
      {step === 'REVIEW_DRAFT' && (
        <div className="space-y-6">
          {/* Header & Verification Alert */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Step 2 of 2: Grounded Profile Review
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">
                Review &amp; Confirm Your Candidate Profile
              </h2>
              {draftProfile.originalFilename && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted from: <strong className="text-slate-200">{draftProfile.originalFilename}</strong>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Profile Completion</span>
                <span className="text-lg font-bold text-emerald-400">
                  {draftProfile.completionPercentage}%
                </span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                {draftProfile.completionPercentage}%
              </div>
            </div>
          </div>

          {/* NEVER TRUST AI BLINDLY - PROVENANCE BANNER */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Strict Truth-Preservation Policy &amp; Provenance Tracking</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never trust AI extractions blindly. Every field below displays its exact provenance. You can edit any value before saving your authoritative Master Profile.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Extracted from CV
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 text-blue-400 px-2 py-0.5 border border-blue-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> User Entered
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 text-amber-400 px-2 py-0.5 border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span> Inferred / Needs Confirmation
              </span>
            </div>
          </div>

          {/* NATURAL LANGUAGE PREFERENCES INPUT */}
          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 ring-1 ring-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <h4 className="font-bold text-white text-sm">
                  Define Career Goals in Natural Language
                </h4>
              </div>
              <span className="text-[10px] text-indigo-300 uppercase tracking-wider font-semibold">
                AI Preference Parser
              </span>
            </div>

            <textarea
              rows={3}
              value={naturalGoal}
              onChange={(e) => setNaturalGoal(e.target.value)}
              placeholder="e.g.: I am looking for Business Analyst, Data Analyst, BI entry-level jobs in Dhaka or remote. Minimum 35,000 BDT..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleParseGoalWithAI}
                disabled={isParsingGoal}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isParsingGoal ? 'Extracting Preferences...' : 'Update Career Preferences'}</span>
              </button>
            </div>
          </div>

          {/* EDITABLE SECTIONS */}
          <div className="space-y-5">
            {/* 1. Personal & Contact Info */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white">1. Personal &amp; Contact Details</h3>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Extracted / Editable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={draftProfile.fullName || ''}
                    onChange={(e) =>
                      setDraftProfile({ ...draftProfile, fullName: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={draftProfile.email || ''}
                    onChange={(e) =>
                      setDraftProfile({ ...draftProfile, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={draftProfile.phone || ''}
                    onChange={(e) =>
                      setDraftProfile({ ...draftProfile, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={draftProfile.city || 'Dhaka'}
                    onChange={(e) =>
                      setDraftProfile({ ...draftProfile, city: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Professional Bio / Summary</label>
                <textarea
                  rows={3}
                  value={draftProfile.bio || ''}
                  onChange={(e) =>
                    setDraftProfile({ ...draftProfile, bio: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* 2. Education */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white">2. Verified Education</h3>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Extracted
                </span>
              </div>

              {draftProfile.education && draftProfile.education.length > 0 ? (
                draftProfile.education.map((edu: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => {
                          const updated = [...draftProfile.education];
                          updated[idx].degree = e.target.value;
                          setDraftProfile({ ...draftProfile, education: updated });
                        }}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Major / Concentration</label>
                      <input
                        type="text"
                        value={edu.major || ''}
                        onChange={(e) => {
                          const updated = [...draftProfile.education];
                          updated[idx].major = e.target.value;
                          setDraftProfile({ ...draftProfile, education: updated });
                        }}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Institution &amp; CGPA</label>
                      <input
                        type="text"
                        value={`${edu.institution || ''} ${edu.cgpa ? `| CGPA ${edu.cgpa}` : ''}`}
                        onChange={(e) => {
                          const updated = [...draftProfile.education];
                          updated[idx].institution = e.target.value;
                          setDraftProfile({ ...draftProfile, education: updated });
                        }}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">
                  No education records detected. You can add your degree manually.
                </div>
              )}
            </div>

            {/* 3. Core Skills */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white">3. Core Skills Inventory</h3>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Extracted ({draftProfile.skills?.length || 0} skills)
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {draftProfile.skills?.map((sk: any, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-200"
                  >
                    <span>{sk.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">({sk.category})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Structured Career Preferences */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white">4. Target Career Preferences</h3>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Configured
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Target Job Roles:</span>
                  <div className="flex flex-wrap gap-1">
                    {draftProfile.careerPreferences?.targetTitles?.map((t: string, i: number) => (
                      <span key={i} className="bg-slate-800 px-2 py-0.5 rounded text-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Preferred Locations:</span>
                  <span className="font-semibold text-white">
                    {draftProfile.careerPreferences?.locations?.join(', ')} (
                    {draftProfile.careerPreferences?.remotePreference})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Minimum Desired Salary:</span>
                  <span className="font-semibold text-emerald-400">
                    {draftProfile.careerPreferences?.minSalary?.toLocaleString()}{' '}
                    {draftProfile.careerPreferences?.currency} / month
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep('UPLOAD_FILE')}
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Choose Another File</span>
            </button>

            <button
              onClick={handleConfirmAndSave}
              disabled={savingProfile}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/50 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{savingProfile ? 'Saving Profile...' : 'Confirm Profile & Discover Jobs'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CONFIRMED */}
      {step === 'CONFIRMED' && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-12 text-center space-y-4 ring-1 ring-emerald-500/30">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Master Career Profile Confirmed!</h2>
          <p className="text-sm text-emerald-300">
            Your candidate profile and preferences have been established from your CV. Redirecting to your AI Discovery Dashboard...
          </p>
        </div>
      )}
    </div>
  );
}
