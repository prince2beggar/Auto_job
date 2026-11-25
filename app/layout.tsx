import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'CareerPilot AI | Personal AI Job Hunting Agent',
  description:
    'AI-powered personal job-hunting agent discovering, evaluating eligibility, tailoring truthful CVs, and tracking applications across private, government, and graduate opportunities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CareerPilot AI Agent • Truth-Preserving Career Automation Engine</span>
            <span className="text-slate-600">MVP Production Ready • BD & Global Architecture</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
