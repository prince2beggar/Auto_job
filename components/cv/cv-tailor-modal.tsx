'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Download,
  Save,
  FileText,
  FileCode,
  Eye,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
  CheckSquare,
  Code2,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Square,
  Circle,
  EyeOff,
  MoveHorizontal
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PROFILE_PHOTO_BASE64 } from '@/lib/assets/profile-photo';
import { LatexTemplateAgent } from '@/lib/agents/latex-template-agent';

interface CVTailorModalProps {
  job: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CVTailorModal({ job, onClose, onSuccess }: CVTailorModalProps) {
  const [loading, setLoading] = useState(true);
  const [tailoredData, setTailoredData] = useState<any | null>(null);
  const [rawProfile, setRawProfile] = useState<any | null>(null);
  const [latexCode, setLatexCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'LATEX' | 'DIFF'>('PREVIEW');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);

  // Canva-style Interactive Visual Editor States
  const [isEditMode, setIsEditMode] = useState(false);
  const [photoConfig, setPhotoConfig] = useState({
    show: true,
    sizePt: 72, // pt for jsPDF (approx 96px on screen, 2.7cm in LaTeX)
    sizeCm: 2.7,
    offsetX: 0, // px shift in preview, maps to cm in LaTeX
    shape: 'rounded' as 'rounded' | 'circle' | 'square',
  });

  // Editable CV Content States
  const [editableSummary, setEditableSummary] = useState<string>('');
  const [editableSkills, setEditableSkills] = useState<string[]>([]);
  const [newSkillText, setNewSkillText] = useState('');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  const [editableExperiences, setEditableExperiences] = useState([
    {
      jobTitle: 'Marketing and Business Development',
      period: 'shyamoli | Feb 2026 to Present',
      company: 'DataIT Digital Solutions | datait.com.bd',
      portfolioUrl: 'https://drive.google.com/drive/folders/1rPkZXZZu2IjBwTLiyNlGxtBaAE6Ddtxz',
      bullets: [
        'Oversee multi-brand marketing operations across DataIT and sister companies, directing campaign priorities and brand positioning across platforms.',
        'Handle client-facing communication and stakeholder coordination, bridging requirements between management, software development teams and external partners.',
        'Lead competitor and market analysis to surface actionable business insights; present findings to leadership and strategic planning teams.',
        'Drive end-to-end recruitment cycles including role scoping, profiling, screening and evaluation; manage customer data collection and sales tracking.',
      ],
    },
    {
      jobTitle: 'Business Analytics',
      period: 'Remote | 2025 June to 2026 Jan',
      company: 'TechShilpo, Innovative Software Solutions | techshilpo.com',
      portfolioUrl: '',
      bullets: [
        'Built Power BI and Excel dashboards for the Smart City initiative (Birganj City Care), optimising Ride Sharing and Delivery KPIs through user behaviour analysis.',
        'Tracked audience trends and content engagement for Alok Patrika online newspaper; delivered editorial strategy insights and streamlined Power Query pipelines.',
      ],
    },
  ]);

  const [editableProjects, setEditableProjects] = useState([
    {
      title: 'Data Professional Survey Dashboard',
      tools: 'Power BI, DAX, Power Query | 2025',
      url: 'https://github.com/mdprince007/Data-Professional-survey-Powerbi',
      bullets: ['Analysed 630 professionals; Python ranked top language; salary satisfaction average 5.86 out of 10.'],
    },
    {
      title: 'Vrinda Store Annual Sales Report',
      tools: 'Excel, Pivot Tables | 2025',
      url: 'https://github.com/mdprince007/Virinda_Store_Data_Analysis_2022',
      bullets: ['Revealed women aged 30 to 49 drive 65% of purchases; dynamic pivot table dashboard with customer segmentation.'],
    },
    {
      title: 'Kevin Cookie Company Sales Dashboard',
      tools: 'Excel, Slicers, Charts | 2025',
      url: 'https://github.com/mdprince007/kevin-Cookie-Company',
      bullets: ['Global 2019 to 2020 sales dashboard with region and product-level drill-down via interactive slicers.'],
    },
    {
      title: 'Tamim Iqbal Cricket Performance Dashboard',
      tools: 'Power BI | 2025',
      url: 'https://github.com/mdprince007/Tamim-Iqbal-Cricket-Dashboard',
      bullets: ['Career statistics across ODI, Test and T20 formats with dynamic year and format filters.'],
    },
  ]);

  // Track initial tailored state for reset
  const initialDataRef = useRef<{
    summary: string;
    skills: string[];
    experiences: any[];
    projects: any[];
  } | null>(null);

  useEffect(() => {
    fetchTailoredCV();
  }, [job.id]);

  const fetchTailoredCV = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/cv/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, saveVersion: false }),
      });
      const data = await res.json();
      if (res.ok) {
        setTailoredData(data.tailored);
        const cleanSummary = (data.tailored.tailoredSummary || '').replace(/[—–]/g, ', ');
        const skillsList = (data.tailored.orderedSkills || []).map((s: any) => s.name.replace(/[—–]/g, ''));

        setEditableSummary(cleanSummary);
        setEditableSkills(skillsList);
        setLatexCode(data.latexCode || '');

        initialDataRef.current = {
          summary: cleanSummary,
          skills: [...skillsList],
          experiences: JSON.parse(JSON.stringify(editableExperiences)),
          projects: JSON.parse(JSON.stringify(editableProjects)),
        };

        // Also fetch candidate profile for dynamic client LaTeX rebuilds
        const pRes = await fetch('/api/profile');
        if (pRes.ok) {
          const pData = await pRes.json();
          setRawProfile(pData.profile);
        }
      } else {
        setError(data.error || 'Failed to tailor CV');
      }
    } catch (e) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  // Re-synchronize LaTeX Code whenever user edits visually
  useEffect(() => {
    if (!rawProfile) return;

    const shiftCm = -1.0 + photoConfig.offsetX * 0.03;
    const widthCm = photoConfig.sizeCm;

    try {
      const newLatex = LatexTemplateAgent.generateOverleafLatex(
        rawProfile,
        job,
        tailoredData,
        {
          showPhoto: photoConfig.show,
          photoWidthCm: widthCm,
          photoXShiftCm: shiftCm,
          photoYShiftCm: -0.9,
          customSummary: editableSummary,
          customSkills: editableSkills,
          customExperiences: editableExperiences,
          customProjects: editableProjects,
        }
      );
      setLatexCode(newLatex);
    } catch (err) {
      console.error('Error regenerating LaTeX:', err);
    }
  }, [editableSummary, editableSkills, editableExperiences, editableProjects, photoConfig, rawProfile]);

  // Skill Reordering Actions
  const moveSkill = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editableSkills.length) return;
    const updated = [...editableSkills];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setEditableSkills(updated);
  };

  const removeSkill = (index: number) => {
    setEditableSkills(editableSkills.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    const trimmed = newSkillText.trim().replace(/[—–]/g, '');
    if (!trimmed) return;
    if (!editableSkills.includes(trimmed)) {
      setEditableSkills([...editableSkills, trimmed]);
    }
    setNewSkillText('');
    setShowAddSkillInput(false);
  };

  // Experience Bullet Actions
  const updateExperienceBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const updated = [...editableExperiences];
    updated[expIndex].bullets[bulletIndex] = text.replace(/[—–]/g, ', ');
    setEditableExperiences(updated);
  };

  const removeExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...editableExperiences];
    updated[expIndex].bullets.splice(bulletIndex, 1);
    setEditableExperiences(updated);
  };

  const addExperienceBullet = (expIndex: number) => {
    const updated = [...editableExperiences];
    updated[expIndex].bullets.push('Contributed to business process optimization and stakeholder reporting.');
    setEditableExperiences(updated);
  };

  // Project Bullet Actions
  const updateProjectBullet = (projIndex: number, bulletIndex: number, text: string) => {
    const updated = [...editableProjects];
    updated[projIndex].bullets[bulletIndex] = text.replace(/[—–]/g, ', ');
    setEditableProjects(updated);
  };

  const removeProjectBullet = (projIndex: number, bulletIndex: number) => {
    const updated = [...editableProjects];
    updated[projIndex].bullets.splice(bulletIndex, 1);
    setEditableProjects(updated);
  };

  // Reset to Baseline
  const handleReset = () => {
    if (initialDataRef.current) {
      setEditableSummary(initialDataRef.current.summary);
      setEditableSkills([...initialDataRef.current.skills]);
      setEditableExperiences(JSON.parse(JSON.stringify(initialDataRef.current.experiences)));
      setEditableProjects(JSON.parse(JSON.stringify(initialDataRef.current.projects)));
      setPhotoConfig({
        show: true,
        sizePt: 72,
        sizeCm: 2.7,
        offsetX: 0,
        shape: 'rounded',
      });
    }
  };

  const handleSaveVersion = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/cv/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, saveVersion: true }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        if (onSuccess) onSuccess();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLatex = async () => {
    if (!latexCode) return;
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2500);
    } catch (err) {
      console.error('Failed to copy LaTeX code:', err);
    }
  };

  const handleDownloadTex = () => {
    if (!latexCode) return;
    const blob = new Blob([latexCode], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeCompany = job.company.replace(/[^a-zA-Z0-9]/g, '_');
    link.href = url;
    link.download = `MD_ASADUJJAMAN_PRINCE_CV_${safeCompany}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!tailoredData) return;
    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter',
    });

    const navyDark = [27, 46, 75]; // #1B2E4B
    const navyMid = [44, 71, 112]; // #2C4770
    const gold = [184, 151, 42]; // #B8972A
    const bodyText = [26, 26, 26]; // #1A1A1A
    const greyDate = [85, 85, 85]; // #555555
    const tagBg = [237, 241, 247]; // #EDF1F7

    const margin = 38;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;

    // 1. Photo Placement (Respecting Canva-style size and offset)
    if (photoConfig.show) {
      try {
        const photoPt = photoConfig.sizePt;
        const photoX = pageWidth - margin - photoPt + (photoConfig.offsetX * 0.7);
        const photoY = 36;
        doc.addImage(PROFILE_PHOTO_BASE64, 'JPEG', photoX, photoY, photoPt, photoPt);
        doc.setDrawColor(210, 215, 225);
        doc.setLineWidth(0.6);
        doc.rect(photoX, photoY, photoPt, photoPt);
      } catch (err) {
        console.error('Could not render photo in PDF:', err);
      }
    }

    let y = 48;

    // 2. Candidate Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18.5);
    doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
    const headerCenterX = photoConfig.show ? (pageWidth - 76) / 2 : pageWidth / 2;
    doc.text('MD ASADUJJAMAN PRINCE', headerCenterX, y, { align: 'center' });
    y += 15;

    // 3. Location
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
    doc.text('Banashree, Dhaka', headerCenterX, y, { align: 'center' });
    y += 14;

    // 4. Contact Line (Zero em-dashes)
    doc.setFontSize(8.2);
    doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
    const contactLine = '+880 1611-939851   |   mdprince.bd111@gmail.com   |   LinkedIn   |   GitHub';
    doc.text(contactLine, headerCenterX, y, { align: 'center' });
    y += 16;

    // 5. Solid Navy Divider Rule
    doc.setDrawColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.setLineWidth(1.6);
    doc.line(margin, y, pageWidth - margin, y);
    y += 16;

    // Section Heading Helper
    const renderSectionHeading = (title: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
      doc.text(title.toUpperCase(), margin, y);
      y += 4;
      doc.setDrawColor(gold[0], gold[1], gold[2]);
      doc.setLineWidth(0.8);
      doc.line(margin, y, pageWidth - margin, y);
      y += 11;
    };

    // SECTION: Career Objective
    renderSectionHeading('Career Objective');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
    const splitObjective = doc.splitTextToSize(editableSummary, contentWidth);
    doc.text(splitObjective, margin, y);
    y += splitObjective.length * 10.5 + 6;

    // SECTION: Core Skills
    renderSectionHeading('Core Skills');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    let curX = margin;
    editableSkills.forEach((sk) => {
      const tagText = sk.replace(/[—–]/g, '');
      const textWidth = doc.getTextWidth(tagText);
      const boxWidth = textWidth + 8;
      const boxHeight = 12;

      if (curX + boxWidth > pageWidth - margin) {
        curX = margin;
        y += 15;
      }

      doc.setFillColor(tagBg[0], tagBg[1], tagBg[2]);
      doc.rect(curX, y - 9, boxWidth, boxHeight, 'F');

      doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
      doc.text(tagText, curX + 4, y);
      curX += boxWidth + 3.5;
    });
    y += 17;

    // SECTION: Education
    renderSectionHeading('Education');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
    doc.text('Bachelor of Business Administration, Major in Management Information Systems', margin, y);
    doc.text('2021 to 2025', pageWidth - margin, y, { align: 'right' });
    y += 11;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.2);
    doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
    doc.text('East West University, Dhaka, Bangladesh', margin, y);
    doc.text('CGPA: 3.55 / 4.00', pageWidth - margin, y, { align: 'right' });
    y += 15;

    // SECTION: Experience
    renderSectionHeading('Experience');
    editableExperiences.forEach((exp) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.8);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      doc.text(exp.jobTitle, margin, y);
      doc.text(exp.period, pageWidth - margin, y, { align: 'right' });
      y += 11;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.2);
      doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
      doc.text(exp.company, margin, y);
      if (exp.portfolioUrl) {
        doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
        doc.text('View Portfolio', pageWidth - margin, y, { align: 'right' });
      }
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      exp.bullets.forEach((bullet) => {
        const split = doc.splitTextToSize(`•  ${bullet}`, contentWidth - 8);
        doc.text(split, margin + 4, y);
        y += split.length * 10;
      });
      y += 5;
    });

    // SECTION: Key Projects
    renderSectionHeading('Key Projects');
    editableProjects.forEach((proj) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      doc.text(proj.title, margin, y);

      const titleWidth = doc.getTextWidth(proj.title);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
      doc.text(`   ${proj.tools}`, margin + titleWidth, y);

      doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
      doc.text('[View]', pageWidth - margin, y, { align: 'right' });
      y += 9.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      proj.bullets.forEach((b) => {
        const splitDesc = doc.splitTextToSize(`•  ${b}`, contentWidth - 8);
        doc.text(splitDesc, margin + 4, y);
        y += splitDesc.length * 10 + 2;
      });
    });
    y += 5;

    // SECTION: Certifications
    renderSectionHeading('Certifications');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);

    const certCol1 = [
      { name: 'Business Analytics with Excel', meta: 'Simplilearn, Jul 2025' },
      { name: 'Introduction to Prompt Engineering', meta: 'Simplilearn, Jun 2025' },
    ];
    const certCol2 = [
      { name: 'Intro to Generative AI Studio', meta: 'Simplilearn, Jun 2025' },
      { name: 'Trello for Beginners', meta: 'Coursera, Sep 2025' },
    ];

    const colWidth = contentWidth / 2;
    for (let i = 0; i < 2; i++) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
      doc.text('[✓]', margin, y);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      doc.text(` ${certCol1[i].name}`, margin + 14, y);
      const nameW = doc.getTextWidth(` ${certCol1[i].name}`);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
      doc.text(` ${certCol1[i].meta}`, margin + 14 + nameW, y);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
      doc.text('[✓]', margin + colWidth, y);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      doc.text(` ${certCol2[i].name}`, margin + colWidth + 14, y);
      const nameW2 = doc.getTextWidth(` ${certCol2[i].name}`);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
      doc.text(` ${certCol2[i].meta}`, margin + colWidth + 14 + nameW2, y);

      y += 11;
    }

    const safeCompany = job.company.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(`MD_ASADUJJAMAN_PRINCE_CV_${safeCompany}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl my-6 flex flex-col max-h-[94vh] overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-3.5 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Canva-Style Resume Studio &amp; Overleaf Generator</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#1B2E4B] text-[#B8972A] border border-[#B8972A]/40 px-2 py-0.5 rounded">
                  Interactive Builder
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tailoring for: <strong className="text-slate-200">{job.title}</strong> at {job.company}
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

        {/* Navigation Tabs & Edit Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/50 px-6 py-2 gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('PREVIEW')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'PREVIEW'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Resume Canvas</span>
            </button>

            <button
              onClick={() => setActiveTab('LATEX')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'LATEX'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="h-3.5 w-3.5 text-[#B8972A]" />
              <span>Overleaf LaTeX (.tex)</span>
            </button>

            <button
              onClick={() => setActiveTab('DIFF')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'DIFF'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>AI Tailoring Diff</span>
            </button>
          </div>

          {/* Canva Visual Mode Toggle */}
          {activeTab === 'PREVIEW' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                  isEditMode
                    ? 'bg-[#B8972A] text-slate-950 ring-2 ring-[#B8972A]/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditMode ? 'Exit Editor Mode' : '🎨 Canva Visual Editor'}</span>
              </button>

              {isEditMode && (
                <button
                  onClick={handleReset}
                  title="Reset to initial AI tailored state"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:text-rose-400 text-xs font-semibold transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* CANVA-STYLE QUICK TOOLBAR (When Edit Mode is ON) */}
        {activeTab === 'PREVIEW' && isEditMode && (
          <div className="bg-slate-900/95 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Photo Visibility */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] font-medium">Photo:</span>
                <button
                  onClick={() => setPhotoConfig({ ...photoConfig, show: !photoConfig.show })}
                  className={`p-1 rounded transition ${
                    photoConfig.show ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={photoConfig.show ? 'Hide photo' : 'Show photo'}
                >
                  {photoConfig.show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Photo Size Buttons */}
              {photoConfig.show && (
                <>
                  <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] font-medium mr-1">Size:</span>
                    <button
                      onClick={() => setPhotoConfig({ ...photoConfig, sizePt: 60, sizeCm: 2.0 })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        photoConfig.sizeCm === 2.0 ? 'bg-[#1B2E4B] text-[#B8972A]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      S (2cm)
                    </button>
                    <button
                      onClick={() => setPhotoConfig({ ...photoConfig, sizePt: 72, sizeCm: 2.7 })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        photoConfig.sizeCm === 2.7 ? 'bg-[#1B2E4B] text-[#B8972A]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      M (2.7cm)
                    </button>
                    <button
                      onClick={() => setPhotoConfig({ ...photoConfig, sizePt: 85, sizeCm: 3.2 })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        photoConfig.sizeCm === 3.2 ? 'bg-[#1B2E4B] text-[#B8972A]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      L (3.2cm)
                    </button>
                  </div>

                  {/* Photo Position Shift */}
                  <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[11px] font-medium mr-1">Position:</span>
                    <button
                      onClick={() => setPhotoConfig({ ...photoConfig, offsetX: photoConfig.offsetX - 8 })}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Nudge photo Left"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-mono text-[10px] text-slate-300 px-1">
                      {photoConfig.offsetX === 0 ? 'Center' : `${photoConfig.offsetX > 0 ? '+' : ''}${photoConfig.offsetX}px`}
                    </span>
                    <button
                      onClick={() => setPhotoConfig({ ...photoConfig, offsetX: photoConfig.offsetX + 8 })}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Nudge photo Right"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Photo Corner Shape */}
                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setPhotoConfig({ ...photoConfig, shape: 'rounded' })}
                      className={`p-1 rounded ${photoConfig.shape === 'rounded' ? 'text-emerald-400 bg-slate-800' : 'text-slate-400'}`}
                      title="Rounded corners"
                    >
                      <Square className="h-3.5 w-3.5 rounded-sm" />
                    </button>
                    <button
                      onClick={() => setPhotoConfig({ ...photoConfig, shape: 'circle' })}
                      className={`p-1 rounded ${photoConfig.shape === 'circle' ? 'text-emerald-400 bg-slate-800' : 'text-slate-400'}`}
                      title="Circular avatar"
                    >
                      <Circle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Click any text to edit • Drag/Reorder skills • Real-time LaTeX sync active</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
              <p className="text-sm text-slate-400">Loading CV Studio canvas for {job.company}...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 text-center text-rose-300 text-sm">
              {error}
            </div>
          ) : tailoredData ? (
            <>
              {/* TAB 1: RESUME CANVAS (Canva-style interactive) */}
              {activeTab === 'PREVIEW' && (
                <div className="mx-auto max-w-[820px] bg-white text-[#1A1A1A] p-6 sm:p-10 shadow-2xl rounded-lg font-sans border border-slate-300 space-y-3.5 relative transition-all">
                  {/* Photo at Top Right */}
                  {photoConfig.show && (
                    <div
                      className="absolute top-6 right-6 sm:top-9 sm:right-9 transition-all"
                      style={{
                        transform: `translateX(${photoConfig.offsetX}px)`,
                      }}
                    >
                      <div className="relative group">
                        <img
                          src="/profilepic.jpg"
                          alt="MD ASADUJJAMAN PRINCE"
                          style={{
                            width: `${(photoConfig.sizeCm / 2.7) * 96}px`,
                            height: `${(photoConfig.sizeCm / 2.7) * 96}px`,
                          }}
                          className={`object-cover border border-slate-300 shadow-sm transition-all ${
                            photoConfig.shape === 'circle'
                              ? 'rounded-full'
                              : photoConfig.shape === 'square'
                              ? 'rounded-none'
                              : 'rounded-sm'
                          }`}
                        />
                        {isEditMode && (
                          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-sm transition text-white text-[10px] font-bold pointer-events-none">
                            {photoConfig.sizeCm}cm
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Overleaf Resume Header */}
                  <div className={`text-center space-y-1 ${photoConfig.show ? 'pr-20 sm:pr-28' : ''}`}>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2E4B] uppercase">
                      MD ASADUJJAMAN PRINCE
                    </h1>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#2C4770] font-medium">
                      <MapPin className="h-3.5 w-3.5 text-[#2C4770] shrink-0" />
                      <span>Banashree, Dhaka</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11.5px] text-[#1A1A1A] pt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-[#2C4770]" />
                        <span>+880 1611-939851</span>
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-[#2C4770]" />
                        <span>mdprince.bd111@gmail.com</span>
                      </span>
                      <span className="text-slate-400">|</span>
                      <a
                        href="https://linkedin.com/in/mdasadujjamanprince"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[#2C4770] hover:underline font-medium"
                      >
                        <Linkedin className="h-3 w-3 text-[#2C4770]" />
                        <span>LinkedIn</span>
                      </a>
                      <span className="text-slate-400">|</span>
                      <a
                        href="https://github.com/mdprince007"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[#2C4770] hover:underline font-medium"
                      >
                        <Github className="h-3 w-3 text-[#2C4770]" />
                        <span>GitHub</span>
                      </a>
                    </div>
                  </div>

                  {/* Navy Divider Rule */}
                  <div className="h-[2px] bg-[#1B2E4B] w-full mt-2 mb-3"></div>

                  {/* Section: Career Objective */}
                  <div className="space-y-1.5 group">
                    <div className="flex items-center justify-between border-b-[1px] border-[#B8972A] pb-0.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C4770]">
                        Career Objective
                      </h3>
                      {isEditMode && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Edit3 className="h-3 w-3 text-[#B8972A]" />
                          <span>Click to edit text</span>
                        </span>
                      )}
                    </div>

                    {isEditMode ? (
                      <textarea
                        value={editableSummary}
                        onChange={(e) => setEditableSummary(e.target.value.replace(/[—–]/g, ', '))}
                        className="w-full text-xs text-[#1A1A1A] leading-relaxed p-2 rounded border border-emerald-500/50 bg-emerald-50/20 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans resize-y"
                        rows={3}
                      />
                    ) : (
                      <p className="text-xs text-[#1A1A1A] leading-relaxed text-justify">
                        {editableSummary}
                      </p>
                    )}
                  </div>

                  {/* Section: Core Skills */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between border-b-[1px] border-[#B8972A] pb-0.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C4770]">
                        Core Skills
                      </h3>
                      {isEditMode && (
                        <button
                          onClick={() => setShowAddSkillInput(true)}
                          className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100/60 hover:bg-emerald-100 px-2 py-0.5 rounded font-bold transition"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Skill</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {editableSkills.map((sk, idx) => (
                        <div
                          key={idx}
                          className="group relative inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#EDF1F7] text-[#1B2E4B] border border-[#d6e0ea] transition"
                        >
                          {isEditMode && idx > 0 && (
                            <button
                              onClick={() => moveSkill(idx, 'left')}
                              className="text-slate-400 hover:text-[#2C4770] p-0.5"
                              title="Move skill left"
                            >
                              <ArrowLeft className="h-2.5 w-2.5" />
                            </button>
                          )}

                          <span>{sk}</span>

                          {isEditMode && idx < editableSkills.length - 1 && (
                            <button
                              onClick={() => moveSkill(idx, 'right')}
                              className="text-slate-400 hover:text-[#2C4770] p-0.5"
                              title="Move skill right"
                            >
                              <ArrowRight className="h-2.5 w-2.5" />
                            </button>
                          )}

                          {isEditMode && (
                            <button
                              onClick={() => removeSkill(idx)}
                              className="text-rose-500 hover:text-rose-700 ml-0.5"
                              title="Delete skill"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Add Skill Inline Form */}
                      {isEditMode && showAddSkillInput && (
                        <div className="inline-flex items-center gap-1 bg-white border border-emerald-500 rounded px-1.5 py-0.5 shadow-sm">
                          <input
                            type="text"
                            placeholder="Skill name..."
                            value={newSkillText}
                            onChange={(e) => setNewSkillText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            autoFocus
                            className="text-[11px] font-bold text-[#1B2E4B] w-24 focus:outline-none"
                          />
                          <button onClick={addSkill} className="text-emerald-600 hover:text-emerald-800">
                            <Check className="h-3 w-3" />
                          </button>
                          <button onClick={() => setShowAddSkillInput(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section: Education */}
                  <div className="space-y-1.5">
                    <div className="border-b-[1px] border-[#B8972A] pb-0.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C4770]">
                        Education
                      </h3>
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-[#1A1A1A]">
                        <span>Bachelor of Business Administration, Major in Management Information Systems</span>
                        <span>2021 to 2025</span>
                      </div>
                      <div className="flex items-center justify-between text-[#555555] italic text-[11px]">
                        <span>East West University, Dhaka, Bangladesh</span>
                        <span>CGPA: 3.55 / 4.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Experience (Interactive bullets & add/remove) */}
                  <div className="space-y-2.5">
                    <div className="border-b-[1px] border-[#B8972A] pb-0.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C4770]">
                        Experience
                      </h3>
                    </div>

                    {editableExperiences.map((exp, expIdx) => (
                      <div key={expIdx} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-[#1A1A1A]">
                          <span>{exp.jobTitle}</span>
                          <span className="font-normal text-[#555555]">{exp.period}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#555555] italic text-[11px]">
                          <span>{exp.company}</span>
                          {exp.portfolioUrl && (
                            <a
                              href={exp.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#2C4770] hover:underline font-medium not-italic"
                            >
                              [View Portfolio]
                            </a>
                          )}
                        </div>

                        <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-[#1A1A1A] leading-relaxed">
                          {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="group">
                              {isEditMode ? (
                                <div className="flex items-start gap-1.5 -ml-1">
                                  <input
                                    type="text"
                                    value={bullet}
                                    onChange={(e) => updateExperienceBullet(expIdx, bIdx, e.target.value)}
                                    className="flex-1 text-[11px] text-[#1A1A1A] p-1 rounded border border-slate-300 focus:border-emerald-500 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => removeExperienceBullet(expIdx, bIdx)}
                                    className="text-slate-400 hover:text-rose-600 p-1"
                                    title="Delete bullet"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <span>{bullet}</span>
                              )}
                            </li>
                          ))}
                        </ul>

                        {isEditMode && (
                          <div className="pl-4 pt-0.5">
                            <button
                              onClick={() => addExperienceBullet(expIdx)}
                              className="flex items-center gap-1 text-[10px] text-emerald-700 hover:underline font-semibold"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add bullet to {exp.jobTitle}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Section: Key Projects (Interactive) */}
                  <div className="space-y-2">
                    <div className="border-b-[1px] border-[#B8972A] pb-0.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C4770]">
                        Key Projects
                      </h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      {editableProjects.map((proj, pIdx) => (
                        <div key={pIdx} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <div>
                              <strong className="text-[#1A1A1A]">{proj.title}</strong>
                              <span className="text-[#555555] italic text-[11px]"> | {proj.tools}</span>
                            </div>
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#2C4770] hover:underline text-[11px] font-medium"
                            >
                              [View]
                            </a>
                          </div>

                          {proj.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="pl-4">
                              {isEditMode ? (
                                <div className="flex items-center gap-1.5 -ml-1">
                                  <input
                                    type="text"
                                    value={b}
                                    onChange={(e) => updateProjectBullet(pIdx, bIdx, e.target.value)}
                                    className="flex-1 text-[11px] text-[#1A1A1A] p-1 rounded border border-slate-300 focus:border-emerald-500 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => removeProjectBullet(pIdx, bIdx)}
                                    className="text-slate-400 hover:text-rose-600 p-1"
                                    title="Delete bullet"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <p className="text-[11px] text-[#1A1A1A] list-item">
                                  {b}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section: Certifications */}
                  <div className="space-y-1.5">
                    <div className="border-b-[1px] border-[#B8972A] pb-0.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C4770]">
                        Certifications
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <CheckSquare className="h-3 w-3 text-[#2C4770] shrink-0" />
                          <strong>Business Analytics with Excel</strong>
                          <span className="text-[#555555]"> | Simplilearn, Jul 2025</span>
                        </span>
                        <a
                          href="https://simpli-web.app.link/e/iu8bwUMbIYb"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2C4770] hover:underline text-[10px]"
                        >
                          [View]
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <CheckSquare className="h-3 w-3 text-[#2C4770] shrink-0" />
                          <strong>Intro to Generative AI Studio</strong>
                          <span className="text-[#555555]"> | Simplilearn, Jun 2025</span>
                        </span>
                        <a
                          href="https://simpli-web.app.link/e/SvjLALJbiXb"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2C4770] hover:underline text-[10px]"
                        >
                          [View]
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <CheckSquare className="h-3 w-3 text-[#2C4770] shrink-0" />
                          <strong>Introduction to Prompt Engineering</strong>
                          <span className="text-[#555555]"> | Simplilearn, Jun 2025</span>
                        </span>
                        <a
                          href="https://simpli-web.app.link/e/j8JaxBxaiXb"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2C4770] hover:underline text-[10px]"
                        >
                          [View]
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <CheckSquare className="h-3 w-3 text-[#2C4770] shrink-0" />
                          <strong>Trello for Beginners</strong>
                          <span className="text-[#555555]"> | Coursera, Sep 2025</span>
                        </span>
                        <a
                          href="https://www.coursera.org/account/accomplishments/verify/K5T6AKP3WHTD"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2C4770] hover:underline text-[10px]"
                        >
                          [View]
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Section: Extracurricular */}
                  <div className="space-y-1">
                    <div className="border-b-[1px] border-[#B8972A] pb-0.5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C4770]">
                        Extracurricular
                      </h3>
                    </div>
                    <p className="text-[11px] text-[#1A1A1A]">
                      <strong>Volunteer, EWU Debate Club</strong> |{' '}
                      <span className="text-[#555555]">
                        National Competition SPREE 2022 | East West University, Dhaka | 2022 | Managed event logistics and coordination for a national inter-university debate competition.
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: OVERLEAF LATEX SOURCE (.TEX) */}
              {activeTab === 'LATEX' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-[#B8972A]" />
                        <span>Dynamically Compiled Overleaf LaTeX (.tex)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Synchronized with your visual Canva edits (photo size: {photoConfig.sizeCm}cm, custom skills and bullets).
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyLatex}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-semibold transition"
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
                        onClick={handleDownloadTex}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold transition shadow"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download .tex</span>
                      </button>

                      <a
                        href="https://www.overleaf.com/project"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 text-xs font-semibold transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open Overleaf</span>
                      </a>
                    </div>
                  </div>

                  {/* Overleaf Image Note */}
                  <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-xl">
                    <span>💡 <strong>Overleaf টিপস:</strong> Overleaf প্রজেক্টে ছবিটি <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200 font-mono">profilepic.jpg</code> নামে আপলোড করে নিবেন।</span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#0d1117] p-4 overflow-hidden">
                    <pre className="text-xs text-emerald-300/90 font-mono whitespace-pre leading-relaxed overflow-x-auto max-h-[60vh]">
                      {latexCode}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: TAILORING DIFF & INSIGHTS */}
              {activeTab === 'DIFF' && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                      Tailoring Actions Executed For This Job
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {tailoredData.changesSummary.map((change: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{change.replace(/[—–]/g, ', ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Summary Comparison */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-400" />
                      <span>1. Career Objective (Original vs Role Tailored)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Original Bio / Master Objective
                        </span>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {tailoredData.originalSummary.replace(/[—–]/g, ', ')}
                        </p>
                      </div>
                      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 ring-1 ring-emerald-500/20">
                        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5">
                          Tailored Objective for {job.company}
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          {editableSummary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reordered Skills */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <span>2. Skill Prioritization for Role</span>
                    </h4>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                      <p className="text-xs text-slate-400 mb-3">
                        Skills required by {job.company} are pushed to the forefront:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {editableSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-lg border font-medium bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-6 py-3 bg-slate-950/80">
          <div className="text-xs text-slate-400">
            {savedSuccess ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Overleaf version saved to Application Tracker!
              </span>
            ) : (
              <span>Live synced: Visual edits instantly update PDF and Overleaf .tex output</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadTex}
              disabled={loading || !latexCode}
              className="flex items-center gap-1.5 rounded-lg border border-[#B8972A]/50 bg-[#1B2E4B]/60 px-3.5 py-2 text-xs font-semibold text-[#B8972A] hover:bg-[#1B2E4B] transition disabled:opacity-50"
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Download .tex (Overleaf)</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={loading || !tailoredData}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleSaveVersion}
              disabled={loading || !tailoredData || isSaving || savedSuccess}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-900/30 disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? 'Saving...' : savedSuccess ? 'Saved' : 'Save Version & Update Tracker'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
