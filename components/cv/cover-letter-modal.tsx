'use client';

import React, { useState, useEffect } from 'react';
import { X, FileText, Copy, Check, Download, Sparkles } from 'lucide-react';

interface CoverLetterModalProps {
  job: any;
  onClose: () => void;
}

export default function CoverLetterModal({ job, onClose }: CoverLetterModalProps) {
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCoverLetter();
  }, [job.id]);

  const fetchCoverLetter = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setCoverLetter(data.coverLetter);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${job.company.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Role-Specific Cover Letter</h2>
              <p className="text-xs text-slate-400">
                Grounded letter for: <strong className="text-slate-200">{job.title}</strong> at {job.company}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-16 text-center space-y-2">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
              <p className="text-sm text-slate-400">
                Generating human, concise cover letter citing verified candidate achievements...
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Personalized Draft (Fully Editable)
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Grounded in Master CV Facts
                </span>
              </div>
              <textarea
                rows={14}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200 font-sans leading-relaxed focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="text-xs text-slate-500">
            Professional tone • Under 250 words • Role-specific
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={loading || !coverLetter}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Download Text</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={loading || !coverLetter}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-900/30 disabled:opacity-50"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Cover Letter'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
