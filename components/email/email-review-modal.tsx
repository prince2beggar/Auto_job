'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Paperclip,
  ShieldAlert,
  Send,
  ExternalLink,
  Copy,
  Check,
  Edit3
} from 'lucide-react';

interface EmailReviewModalProps {
  job: any;
  onClose: () => void;
  onApplicationUpdated?: () => void;
}

export default function EmailReviewModal({
  job,
  onClose,
  onApplicationUpdated,
}: EmailReviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<any | null>(null);
  const [editableBody, setEditableBody] = useState('');
  const [editableSubject, setEditableSubject] = useState('');
  const [editableTo, setEditableTo] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSentMarked, setIsSentMarked] = useState(false);

  useEffect(() => {
    fetchDraft();
  }, [job.id]);

  const fetchDraft = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      });
      const data = await res.json();
      if (res.ok && data.draft) {
        setDraft(data.draft);
        setEditableTo(data.draft.toEmail);
        setEditableSubject(data.draft.subject);
        setEditableBody(data.draft.body);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const fullText = `To: ${editableTo}\nSubject: ${editableSubject}\n\n${editableBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApproveAndOpenGmail = async () => {
    // 1. Mark status in application tracker
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          status: 'APPLIED',
          eventTitle: 'Email Application Dispatched',
          eventDescription: `Application submitted to ${editableTo} with tailored CV attachment.`,
        }),
      });
      setIsSentMarked(true);
      if (onApplicationUpdated) onApplicationUpdated();
    } catch (e) {
      console.error(e);
    }

    // 2. Open Gmail web composer
    const encodedSubject = encodeURIComponent(editableSubject);
    const encodedBody = encodeURIComponent(editableBody);
    const encodedTo = encodeURIComponent(editableTo);
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Review & Approve Email Application</h2>
              <p className="text-xs text-slate-400">
                Applying to: <strong className="text-slate-200">{job.title}</strong> at {job.company}
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

        {/* Safety First Alert Banner */}
        <div className="flex items-center gap-2.5 bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 text-xs text-amber-300">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong>Safety Gate Active:</strong> We never send emails automatically in MVP. Review the recipient, subject, and personalized body below. You have complete control to edit before approving.
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Preparing recruiter address and tailored application body...
            </div>
          ) : draft ? (
            <>
              {/* To field */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Recipient (Recruiter Email)
                </label>
                <input
                  type="email"
                  value={editableTo}
                  onChange={(e) => setEditableTo(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Subject field */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={editableSubject}
                  onChange={(e) => setEditableSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Attachment Pill */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Attached Resume File
                </label>
                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200">
                  <Paperclip className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="font-medium">{draft.attachmentName}</span>
                  <span className="text-[10px] text-slate-400">(Tailored PDF)</span>
                </div>
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Personalized Application Body
                  </label>
                  <span className="text-[10px] text-slate-500">Editable</span>
                </div>
                <textarea
                  rows={10}
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200 font-sans leading-relaxed focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-6 py-4 bg-slate-950/60">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Content'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              onClick={handleApproveAndOpenGmail}
              disabled={loading || !draft}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-900/30 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Approve & Dispatch via Gmail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
