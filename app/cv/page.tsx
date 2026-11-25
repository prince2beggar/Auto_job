'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  Globe,
  ExternalLink,
  Download,
  Copy,
  Check,
  RotateCcw,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  ArrowRight,
  Eye,
  FileCode,
  Square,
  Circle,
  EyeOff,
  MoveHorizontal,
  ChevronDown,
  Building,
  CheckSquare,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PROFILE_PHOTO_BASE64 } from '@/lib/assets/profile-photo';
import { LatexTemplateAgent } from '@/lib/agents/latex-template-agent';

export default function CVStudioPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('master');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [rawProfile, setRawProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [tailoring, setTailoring] = useState(false);
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'LATEX'>('PREVIEW');
  const [copiedLatex, setCopiedLatex] = useState(false);

  // Canva-style Interactive Visual Editor States
  const [isEditMode, setIsEditMode] = useState(false);
  const [photoConfig, setPhotoConfig] = useState({
    show: true,
    sizePt: 72,
    sizeCm: 2.7,
    offsetX: 0,
    shape: 'rounded' as 'rounded' | 'circle' | 'square',
  });

  // Editable CV Content States
  const [editableSummary, setEditableSummary] = useState<string>(
    'Experienced in supporting business operations, coordinating with teams, and handling day-to-day responsibilities in a dynamic startup environment. Background in business analytics, Power BI dashboard development, and digital marketing execution.'
  );
  const [editableSkills, setEditableSkills] = useState<string[]>([
    'Business Operations',
    'Project Coordination',
    'Client Coordination',
    'Market Research',
    'Business Development',
    'Social Media Management',
    'Content Planning',
    'Stakeholder Communication',
    'Documentation',
    'Microsoft Excel',
    'Data Analysis',
    'Problem Solving',
    'Team Collaboration',
    'Time Management',
    'Adaptability',
  ]);
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

  const [latexCode, setLatexCode] = useState<string>('');

  const initialBaselineRef = useRef<{
    summary: string;
    skills: string[];
    experiences: any[];
    projects: any[];
  } | null>(null);

  // Initial Load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [jobsRes, profileRes] = await Promise.all([
          fetch('/api/jobs'),
          fetch('/api/profile'),
        ]);

        if (jobsRes.ok) {
          const jData = await jobsRes.json();
          setJobs(jData.jobs || []);
        }

        if (profileRes.ok) {
          const pData = await profileRes.json();
          setRawProfile(pData.profile);
        }
      } catch (err) {
        console.error('Failed to load initial studio data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When selected job changes, fetch tailored CV or load master
  useEffect(() => {
    if (selectedJobId === 'master') {
      setSelectedJob(null);
      return;
    }

    const found = jobs.find((j) => j.id === selectedJobId);
    setSelectedJob(found || null);

    if (found) {
      tailorToJob(found.id);
    }
  }, [selectedJobId, jobs]);

  const tailorToJob = async (jobId: string) => {
    setTailoring(true);
    try {
      const res = await fetch('/api/cv/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, saveVersion: false }),
      });
      if (res.ok) {
        const data = await res.json();
        const cleanSummary = (data.tailored?.tailoredSummary || '').replace(/[—–]/g, ', ');
        const skillsList = (data.tailored?.orderedSkills || []).map((s: any) => s.name.replace(/[—–]/g, ''));

        setEditableSummary(cleanSummary);
        setEditableSkills(skillsList);
        setLatexCode(data.latexCode || '');

        initialBaselineRef.current = {
          summary: cleanSummary,
          skills: [...skillsList],
          experiences: JSON.parse(JSON.stringify(editableExperiences)),
          projects: JSON.parse(JSON.stringify(editableProjects)),
        };
      }
    } catch (err) {
      console.error('Tailoring error:', err);
    } finally {
      setTailoring(false);
    }
  };

  // Re-generate LaTeX automatically when visual elements change
  useEffect(() => {
    const shiftCm = -1.0 + photoConfig.offsetX * 0.03;
    const widthCm = photoConfig.sizeCm;

    try {
      const newLatex = LatexTemplateAgent.generateOverleafLatex(
        rawProfile || undefined,
        selectedJob || undefined,
        undefined,
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
      console.error('Error generating LaTeX in Studio:', err);
    }
  }, [editableSummary, editableSkills, editableExperiences, editableProjects, photoConfig, rawProfile, selectedJob]);

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
    if (trimmed && !editableSkills.includes(trimmed)) {
      setEditableSkills([...editableSkills, trimmed]);
      setNewSkillText('');
      setShowAddSkillInput(false);
    }
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
    if (initialBaselineRef.current) {
      setEditableSummary(initialBaselineRef.current.summary);
      setEditableSkills([...initialBaselineRef.current.skills]);
      setEditableExperiences(JSON.parse(JSON.stringify(initialBaselineRef.current.experiences)));
      setEditableProjects(JSON.parse(JSON.stringify(initialBaselineRef.current.projects)));
    } else {
      setEditableSummary(
        'Experienced in supporting business operations, coordinating with teams, and handling day-to-day responsibilities in a dynamic startup environment. Background in business analytics, Power BI dashboard development, and digital marketing execution.'
      );
      setEditableSkills([
        'Business Operations',
        'Project Coordination',
        'Client Coordination',
        'Market Research',
        'Business Development',
        'Social Media Management',
        'Content Planning',
        'Stakeholder Communication',
        'Documentation',
        'Microsoft Excel',
        'Data Analysis',
        'Problem Solving',
        'Team Collaboration',
        'Time Management',
        'Adaptability',
      ]);
    }
    setPhotoConfig({
      show: true,
      sizePt: 72,
      sizeCm: 2.7,
      offsetX: 0,
      shape: 'rounded',
    });
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
    const label = selectedJob ? selectedJob.company.replace(/[^a-zA-Z0-9]/g, '_') : 'Master';
    link.href = url;
    link.download = `MD_ASADUJJAMAN_PRINCE_CV_${label}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter',
    });

    const navyDark = [27, 46, 75];
    const navyMid = [44, 71, 112];
    const gold = [184, 151, 42];
    const bodyText = [26, 26, 26];
    const greyDate = [85, 85, 85];
    const tagBg = [237, 241, 247];

    const margin = 38;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;

    // 1. Photo Placement
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

    // 4. Contact Line
    doc.setFontSize(8.2);
    doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
    const contactLine = '+880 1611-939851   |   mdprince.bd111@gmail.com   |   LinkedIn   |   GitHub';
    doc.text(contactLine, headerCenterX, y, { align: 'center' });
    y += 12;

    // 5. Heavy Divider Rule
    doc.setDrawColor(navyDark[0], navyDark[1], navyDark[2]);
    doc.setLineWidth(1.6);
    doc.line(margin, y, margin + contentWidth, y);
    y += 14;

    const drawSectionHeader = (title: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.8);
      doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
      doc.text(title.toUpperCase(), margin, y);
      y += 3;
      doc.setDrawColor(gold[0], gold[1], gold[2]);
      doc.setLineWidth(0.8);
      doc.line(margin, y, margin + contentWidth, y);
      y += 10;
    };

    // SECTION: CAREER OBJECTIVE
    drawSectionHeader('Career Objective');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.4);
    doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
    const cleanSummary = editableSummary.replace(/[—–]/g, ', ');
    const summaryLines = doc.splitTextToSize(cleanSummary, contentWidth);
    doc.text(summaryLines, margin, y, { lineHeightFactor: 1.18 });
    y += summaryLines.length * 9.8 + 6;

    // SECTION: CORE SKILLS
    drawSectionHeader('Core Skills');
    let skillX = margin;
    const tagHeight = 12.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);

    editableSkills.forEach((skill) => {
      const cleanSkill = skill.replace(/[—–]/g, '');
      const textWidth = doc.getTextWidth(cleanSkill);
      const tagWidth = textWidth + 8;

      if (skillX + tagWidth > margin + contentWidth) {
        skillX = margin;
        y += tagHeight + 3.5;
      }

      doc.setFillColor(tagBg[0], tagBg[1], tagBg[2]);
      doc.rect(skillX, y - 9, tagWidth, tagHeight, 'F');

      doc.setTextColor(navyDark[0], navyDark[1], navyDark[2]);
      doc.text(cleanSkill, skillX + 4, y);

      skillX += tagWidth + 4;
    });
    y += tagHeight + 8;

    // SECTION: EDUCATION
    drawSectionHeader('Education');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
    doc.text('Bachelor of Business Administration, Major in Management Information Systems', margin, y);
    doc.text('2021 to 2025', margin + contentWidth, y, { align: 'right' });
    y += 9.5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.0);
    doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
    doc.text('East West University, Dhaka, Bangladesh', margin, y);
    doc.text('CGPA: 3.55 / 4.00', margin + contentWidth, y, { align: 'right' });
    y += 12;

    // SECTION: EXPERIENCE
    drawSectionHeader('Experience');
    editableExperiences.forEach((exp) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      doc.text(exp.jobTitle, margin, y);
      doc.text(exp.period, margin + contentWidth, y, { align: 'right' });
      y += 9.5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.0);
      doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
      doc.text(exp.company, margin, y);
      if (exp.portfolioUrl) {
        doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
        doc.text('View Portfolio', margin + contentWidth, y, { align: 'right' });
      }
      y += 9.5;

      // Bullet points
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      exp.bullets.forEach((bullet) => {
        const cleanBullet = bullet.replace(/[—–]/g, ', ');
        const bLines = doc.splitTextToSize(cleanBullet, contentWidth - 12);
        doc.text('•', margin + 3, y);
        doc.text(bLines, margin + 12, y, { lineHeightFactor: 1.15 });
        y += bLines.length * 8.8 + 1.2;
      });
      y += 3.5;
    });

    // SECTION: KEY PROJECTS
    drawSectionHeader('Key Projects');
    editableProjects.forEach((proj) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.3);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      doc.text(proj.title, margin, y);

      const titleWidth = doc.getTextWidth(proj.title);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
      doc.text(proj.tools, margin + titleWidth + 6, y);

      doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
      doc.text('[View]', margin + contentWidth, y, { align: 'right' });
      y += 8.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.6);
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      proj.bullets.forEach((bullet) => {
        const cleanBullet = bullet.replace(/[—–]/g, ', ');
        const bLines = doc.splitTextToSize(cleanBullet, contentWidth - 12);
        doc.text('•', margin + 3, y);
        doc.text(bLines, margin + 12, y, { lineHeightFactor: 1.15 });
        y += bLines.length * 8.6 + 1;
      });
      y += 2.5;
    });

    // SECTION: CERTIFICATIONS
    drawSectionHeader('Certifications');
    const colWidth = contentWidth / 2 - 6;
    doc.setFontSize(7.4);

    const certs = [
      { name: 'Business Analytics with Excel', org: 'Simplilearn, Jul 2025' },
      { name: 'Intro to Generative AI Studio', org: 'Simplilearn, Jun 2025' },
      { name: 'Introduction to Prompt Engineering', org: 'Simplilearn, Jun 2025' },
      { name: 'Trello for Beginners', org: 'Coursera, Sep 2025' },
    ];

    for (let i = 0; i < certs.length; i += 2) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
      doc.text(certs[i].name, margin + 4, y);
      const nameW = doc.getTextWidth(certs[i].name);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
      doc.text(certs[i].org, margin + 4 + nameW + 4, y);
      doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
      doc.text('[View]', margin + colWidth - 8, y, { align: 'right' });

      if (certs[i + 1]) {
        const c2X = margin + colWidth + 12;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
        doc.text(certs[i + 1].name, c2X + 4, y);
        const name2W = doc.getTextWidth(certs[i + 1].name);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
        doc.text(certs[i + 1].org, c2X + 4 + name2W + 4, y);
        doc.setTextColor(navyMid[0], navyMid[1], navyMid[2]);
        doc.text('[View]', margin + contentWidth, y, { align: 'right' });
      }
      y += 10;
    }

    // SECTION: EXTRACURRICULAR
    y += 3;
    drawSectionHeader('Extracurricular');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.6);
    doc.setTextColor(bodyText[0], bodyText[1], bodyText[2]);
    doc.text('Volunteer, EWU Debate Club', margin, y);
    const vW = doc.getTextWidth('Volunteer, EWU Debate Club');

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(greyDate[0], greyDate[1], greyDate[2]);
    const extraDesc = 'National Competition SPREE 2022 | East West University, Dhaka | 2022 | Managed event logistics & coordination.';
    const extraLines = doc.splitTextToSize(extraDesc, contentWidth - vW - 8);
    doc.text(extraLines, margin + vW + 6, y);

    const safeTitle = selectedJob ? selectedJob.title.replace(/[^a-zA-Z0-9]/g, '_') : 'Master';
    doc.save(`MD_ASADUJJAMAN_PRINCE_CV_${safeTitle}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Header & Job Selector Banner */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileText className="h-4 w-4" />
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                CV Studio <span className="text-emerald-400 font-mono text-sm">(Overleaf ATS Resume)</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live Canva-style resume builder synchronized with your LaTeX Overleaf template. 1-click ATS PDF export.
            </p>
          </div>

          {/* Job Picker Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Target Role:</span>
              <div className="relative">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-800 py-1.5 pl-3 pr-8 text-xs font-medium text-white hover:border-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="master">🌟 General ATS Master Resume (Default)</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.company} — {job.title} ({job.match?.overallScore || 75}% Match)
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {tailoring && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-md">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                Tailoring...
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Authentic Job Source Verification Card */}
        {selectedJob && (
          <div className="mb-6 rounded-2xl border border-sky-500/30 bg-sky-950/20 p-4 ring-1 ring-sky-500/20 animate-in fade-in">
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
                      Verified Circular
                    </span>
                    <span className="text-xs text-slate-400">• Match Score: <strong className="text-emerald-400">{selectedJob.match?.overallScore || 75}%</strong></span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {selectedJob.source} • {selectedJob.company} — {selectedJob.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-sm sm:max-w-xl font-mono">
                    Official Portal: <span className="text-sky-300">{selectedJob.sourceUrl || selectedJob.applicationUrl}</span>
                  </p>
                </div>
              </div>

              <a
                href={selectedJob.sourceUrl || selectedJob.applicationUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 px-3.5 py-1.5 text-xs font-bold text-sky-200 transition shadow-sm"
              >
                <span>Verify Original Circular</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Master Toolbar */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('PREVIEW')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'PREVIEW'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Visual Resume Studio</span>
              </button>
              <button
                onClick={() => setActiveTab('LATEX')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === 'LATEX'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>Overleaf LaTeX Code</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold border transition ${
                  isEditMode
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                <span>{isEditMode ? 'Editing Active' : 'Canva Edit Mode'}</span>
              </button>

              <button
                onClick={handleReset}
                title="Reset edits to baseline"
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleCopyLatex}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                {copiedLatex ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLatex ? 'Copied' : 'Copy LaTeX'}</span>
              </button>

              <button
                onClick={handleDownloadTex}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .tex</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-900/40"
              >
                <Download className="h-4 w-4" />
                <span>Download ATS PDF</span>
              </button>
            </div>
          </div>

          {/* Canva Photo Tuning Sub-Bar */}
          {isEditMode && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">Profile Photo:</span>
                <button
                  onClick={() => setPhotoConfig({ ...photoConfig, show: !photoConfig.show })}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
                    photoConfig.show ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {photoConfig.show ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  <span>{photoConfig.show ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>

              {photoConfig.show && (
                <>
                  <div className="flex items-center gap-2">
                    <span>Size:</span>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={photoConfig.sizePt}
                      onChange={(e) => {
                        const pt = parseInt(e.target.value);
                        setPhotoConfig({
                          ...photoConfig,
                          sizePt: pt,
                          sizeCm: parseFloat((pt * 0.0352778).toFixed(1)),
                        });
                      }}
                      className="w-24 accent-emerald-500 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-400">{photoConfig.sizeCm}cm</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MoveHorizontal className="h-3.5 w-3.5 text-slate-400" />
                    <span>H-Shift:</span>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={photoConfig.offsetX}
                      onChange={(e) => setPhotoConfig({ ...photoConfig, offsetX: parseInt(e.target.value) })}
                      className="w-24 accent-emerald-500 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-400">{photoConfig.offsetX}px</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span>Shape:</span>
                    <button
                      onClick={() => setPhotoConfig({ ...photoConfig, shape: 'circle' })}
                      className={`p-1 rounded ${photoConfig.shape === 'circle' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                      title="Circular Photo"
                    >
                      <Circle className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setPhotoConfig({ ...photoConfig, shape: 'rounded' })}
                      className={`p-1 rounded ${photoConfig.shape === 'rounded' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                      title="Rounded Square Photo"
                    >
                      <Square className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Resume Paper */}
        {activeTab === 'PREVIEW' ? (
          <div className="flex justify-center">
            <div className="w-full max-w-4xl bg-white text-[#1A1A1A] font-sans p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-300 relative transition-all">
              {/* Photo Node */}
              {photoConfig.show && (
                <div
                  className="absolute top-8 right-8 transition-transform duration-100 ease-out"
                  style={{
                    transform: `translateX(${photoConfig.offsetX}px)`,
                  }}
                >
                  <div
                    className={`overflow-hidden border border-slate-300 shadow-sm bg-slate-100 ${
                      photoConfig.shape === 'circle' ? 'rounded-full' : photoConfig.shape === 'rounded' ? 'rounded-md' : 'rounded-none'
                    }`}
                    style={{
                      width: `${photoConfig.sizePt * 1.3}px`,
                      height: `${photoConfig.sizePt * 1.3}px`,
                    }}
                  >
                    <img
                      src={PROFILE_PHOTO_BASE64}
                      alt="Profile Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditMode && (
                    <div className="text-[9px] text-center text-slate-500 mt-1 font-mono">
                      {photoConfig.sizeCm}cm
                    </div>
                  )}
                </div>
              )}

              {/* Header */}
              <div className="text-center pt-2 pb-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1B2E4B]">
                  MD ASADUJJAMAN PRINCE
                </h1>

                <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2C4770]">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Banashree, Dhaka</span>
                </div>

                <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-[#1A1A1A]">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-[#2C4770]" />
                    <span>+880 1611-939851</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-[#2C4770]" />
                    <span>mdprince.bd111@gmail.com</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#2C4770] font-medium">
                    <Linkedin className="h-3 w-3" />
                    <span>LinkedIn</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#2C4770] font-medium">
                    <Github className="h-3 w-3" />
                    <span>GitHub</span>
                  </span>
                </div>
              </div>

              {/* Heavy Divider Rule */}
              <div className="h-[2px] bg-[#1B2E4B] w-full my-2.5" />

              {/* CAREER OBJECTIVE */}
              <div className="mt-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C4770] pb-0.5">
                  Career Objective
                </h2>
                <div className="h-[1px] bg-[#B8972A] w-full mb-2" />

                {isEditMode ? (
                  <textarea
                    value={editableSummary}
                    onChange={(e) => setEditableSummary(e.target.value)}
                    rows={3}
                    className="w-full text-xs text-[#1A1A1A] leading-relaxed p-2 border border-dashed border-emerald-400 rounded bg-emerald-50/40 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Enter tailored career objective..."
                  />
                ) : (
                  <p className="text-xs text-[#1A1A1A] leading-relaxed text-justify">
                    {editableSummary}
                  </p>
                )}
              </div>

              {/* CORE SKILLS */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C4770] pb-0.5">
                    Core Skills
                  </h2>
                  {isEditMode && (
                    <button
                      onClick={() => setShowAddSkillInput(!showAddSkillInput)}
                      className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-0.5"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Skill Tag</span>
                    </button>
                  )}
                </div>
                <div className="h-[1px] bg-[#B8972A] w-full mb-2" />

                {isEditMode && showAddSkillInput && (
                  <div className="mb-2.5 flex items-center gap-2 bg-emerald-50 p-2 rounded border border-emerald-300">
                    <input
                      type="text"
                      value={newSkillText}
                      onChange={(e) => setNewSkillText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="e.g. Agile Methodology, KPI Reporting"
                      className="text-xs p-1 rounded border border-slate-300 flex-1 focus:outline-none"
                    />
                    <button
                      onClick={addSkill}
                      className="bg-emerald-600 text-white px-2.5 py-1 text-xs font-bold rounded hover:bg-emerald-500"
                    >
                      Add
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {editableSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="group inline-flex items-center gap-1 rounded bg-[#EDF1F7] px-2 py-0.5 text-[11px] font-bold text-[#1B2E4B] border border-slate-200"
                    >
                      <span>{skill}</span>

                      {isEditMode && (
                        <div className="flex items-center gap-0.5 pl-1 border-l border-slate-300 ml-1">
                          {index > 0 && (
                            <button
                              onClick={() => moveSkill(index, 'left')}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Move left"
                            >
                              <ArrowLeft className="h-2.5 w-2.5" />
                            </button>
                          )}
                          {index < editableSkills.length - 1 && (
                            <button
                              onClick={() => moveSkill(index, 'right')}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Move right"
                            >
                              <ArrowRight className="h-2.5 w-2.5" />
                            </button>
                          )}
                          <button
                            onClick={() => removeSkill(index)}
                            className="text-rose-400 hover:text-rose-600 p-0.5"
                            title="Remove tag"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* EDUCATION */}
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C4770] pb-0.5">
                  Education
                </h2>
                <div className="h-[1px] bg-[#B8972A] w-full mb-2" />

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
                    <span>Bachelor of Business Administration, Major in Management Information Systems</span>
                    <span className="font-semibold text-slate-700">2021 to 2025</span>
                  </div>
                  <div className="flex items-center justify-between text-xs italic text-[#555555]">
                    <span>East West University, Dhaka, Bangladesh</span>
                    <span>CGPA: 3.55 / 4.00</span>
                  </div>
                </div>
              </div>

              {/* EXPERIENCE */}
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C4770] pb-0.5">
                  Experience
                </h2>
                <div className="h-[1px] bg-[#B8972A] w-full mb-2" />

                <div className="space-y-3">
                  {editableExperiences.map((exp, expIdx) => (
                    <div key={expIdx}>
                      <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
                        <span>{exp.jobTitle}</span>
                        <span className="font-semibold text-slate-700">{exp.period}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs italic text-[#555555] mb-1">
                        <span>{exp.company}</span>
                        {exp.portfolioUrl && (
                          <a
                            href={exp.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2C4770] hover:underline font-semibold"
                          >
                            View Portfolio
                          </a>
                        )}
                      </div>

                      <ul className="space-y-1 text-xs text-[#1A1A1A] list-disc list-inside">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">
                            {isEditMode ? (
                              <div className="inline-flex items-start gap-1 w-full pl-1">
                                <input
                                  type="text"
                                  value={b}
                                  onChange={(e) => updateExperienceBullet(expIdx, bIdx, e.target.value)}
                                  className="w-full text-xs p-1 border border-dashed border-emerald-400 rounded bg-emerald-50/30 focus:outline-none"
                                />
                                {exp.bullets.length > 1 && (
                                  <button
                                    onClick={() => removeExperienceBullet(expIdx, bIdx)}
                                    className="text-rose-400 hover:text-rose-600 p-1"
                                    title="Delete bullet"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span>{b}</span>
                            )}
                          </li>
                        ))}
                      </ul>

                      {isEditMode && (
                        <button
                          onClick={() => addExperienceBullet(expIdx)}
                          className="mt-1 text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 hover:underline"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Achievement Bullet</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* KEY PROJECTS */}
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C4770] pb-0.5">
                  Key Projects
                </h2>
                <div className="h-[1px] bg-[#B8972A] w-full mb-2" />

                <div className="space-y-2.5">
                  {editableProjects.map((proj, pIdx) => (
                    <div key={pIdx}>
                      <div className="flex items-center justify-between text-xs text-[#1A1A1A]">
                        <div>
                          <strong className="font-bold text-[#1A1A1A]">{proj.title}</strong>
                          <span className="italic text-[#555555] ml-2">{proj.tools}</span>
                        </div>
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2C4770] hover:underline font-semibold text-[11px]"
                        >
                          [View]
                        </a>
                      </div>

                      <ul className="space-y-0.5 text-xs text-[#1A1A1A] list-disc list-inside">
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="leading-relaxed">
                            {isEditMode ? (
                              <div className="inline-flex items-start gap-1 w-full pl-1">
                                <input
                                  type="text"
                                  value={b}
                                  onChange={(e) => updateProjectBullet(pIdx, bIdx, e.target.value)}
                                  className="w-full text-xs p-1 border border-dashed border-emerald-400 rounded bg-emerald-50/30 focus:outline-none"
                                />
                                {proj.bullets.length > 1 && (
                                  <button
                                    onClick={() => removeProjectBullet(pIdx, bIdx)}
                                    className="text-rose-400 hover:text-rose-600 p-1"
                                    title="Delete bullet"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span>{b}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* CERTIFICATIONS */}
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C4770] pb-0.5">
                  Certifications
                </h2>
                <div className="h-[1px] bg-[#B8972A] w-full mb-2" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="h-3 w-3 text-[#2C4770]" />
                      <strong>Business Analytics with Excel</strong>
                      <span className="text-[#555555] text-[11px]">Simplilearn, Jul 2025</span>
                    </span>
                    <a
                      href="https://simpli-web.app.link/e/iu8bwUMbIYb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2C4770] text-[10px] font-semibold hover:underline"
                    >
                      [View]
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="h-3 w-3 text-[#2C4770]" />
                      <strong>Intro to Generative AI Studio</strong>
                      <span className="text-[#555555] text-[11px]">Simplilearn, Jun 2025</span>
                    </span>
                    <a
                      href="https://simpli-web.app.link/e/SvjLALJbiXb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2C4770] text-[10px] font-semibold hover:underline"
                    >
                      [View]
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="h-3 w-3 text-[#2C4770]" />
                      <strong>Introduction to Prompt Engineering</strong>
                      <span className="text-[#555555] text-[11px]">Simplilearn, Jun 2025</span>
                    </span>
                    <a
                      href="https://simpli-web.app.link/e/j8JaxBxaiXb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2C4770] text-[10px] font-semibold hover:underline"
                    >
                      [View]
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="h-3 w-3 text-[#2C4770]" />
                      <strong>Trello for Beginners</strong>
                      <span className="text-[#555555] text-[11px]">Coursera, Sep 2025</span>
                    </span>
                    <a
                      href="https://www.coursera.org/account/accomplishments/verify/K5T6AKP3WHTD"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2C4770] text-[10px] font-semibold hover:underline"
                    >
                      [View]
                    </a>
                  </div>
                </div>
              </div>

              {/* EXTRACURRICULAR */}
              <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#2C4770] pb-0.5">
                  Extracurricular
                </h2>
                <div className="h-[1px] bg-[#B8972A] w-full mb-2" />

                <p className="text-xs text-[#1A1A1A]">
                  <strong>Volunteer, EWU Debate Club</strong>{' '}
                  <span className="text-[#555555]">
                    National Competition SPREE 2022 | East West University, Dhaka | 2022 | Managed event logistics and coordination for national inter-university debate competition.
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* LaTeX Code Tab */
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-emerald-400" />
                  <span>Production-Ready Overleaf LaTeX Source</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Drop into Overleaf.com or your local pdfLaTeX engine. Matches your official template.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLatex}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                >
                  {copiedLatex ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLatex ? 'Copied' : 'Copy LaTeX'}</span>
                </button>
                <button
                  onClick={handleDownloadTex}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .tex</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[700px] border border-slate-800 leading-relaxed selection:bg-emerald-500/30">
              <code>{latexCode}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
