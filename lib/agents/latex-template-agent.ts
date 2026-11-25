import { CandidateProfile, NormalizedJob, TailoredCVDirection } from '../types';

export interface LatexTemplateOptions {
  showPhoto?: boolean;
  photoWidthCm?: number; // e.g. 2.7
  photoXShiftCm?: number; // e.g. -1.0
  photoYShiftCm?: number; // e.g. -0.9
  customSummary?: string;
  customSkills?: string[];
  customExperiences?: Array<{
    jobTitle: string;
    period: string;
    company: string;
    portfolioUrl?: string;
    bullets: string[];
  }>;
  customProjects?: Array<{
    title: string;
    tools: string;
    url: string;
    bullets: string[];
  }>;
}

export class LatexTemplateAgent {
  /**
   * Generates production-ready Overleaf LaTeX code matching the user's exact template.
   * Supports real-time Canva-style options (photo sizing/positioning, edited content, reordered skills).
   */
  static generateOverleafLatex(
    profile?: Partial<CandidateProfile>,
    job?: Partial<NormalizedJob>,
    tailored?: Partial<TailoredCVDirection>,
    options?: LatexTemplateOptions
  ): string {
    const jobTitle = (job?.title || 'Professional Roles').replace(/[—–]/g, ', ');
    const company = (job?.company || 'Target Organization').replace(/[—–]/g, ', ');
    const objective = (
      options?.customSummary ||
      tailored?.tailoredSummary ||
      profile?.bio ||
      `Experienced in supporting business operations, coordinating with teams, and handling day-to-day responsibilities in a dynamic startup environment. Background in business analytics, Power BI dashboard development, and digital marketing execution.`
    ).replace(/[—–]/g, ', ');

    // Format skills tags with bulletproof fallback
    let skillsList: string[] = [];
    if (options?.customSkills && options.customSkills.length > 0) {
      skillsList = options.customSkills;
    } else if (tailored?.orderedSkills && tailored.orderedSkills.length > 0) {
      skillsList = tailored.orderedSkills.map((s) => s.name);
    } else if (profile?.skills && (profile.skills as any).length > 0) {
      skillsList = (profile.skills as any).map((s: any) => (typeof s === 'string' ? s : s.name));
    } else if ((profile as any)?.skills && (profile as any).skills.length > 0) {
      skillsList = (profile as any).skills.map((s: any) => (typeof s === 'string' ? s : s.name));
    }

    if (!skillsList || skillsList.length === 0) {
      skillsList = [
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
      ];
    }
    const skillsLatex = skillsList
      .map((name) => `\\stag{${String(name).replace(/[—–]/g, '')}}`)
      .join('\n');

    // Photo TikZ Node
    const photoWidth = (options?.photoWidthCm ?? 2.7).toFixed(1);
    const photoXShift = (options?.photoXShiftCm ?? -1.0).toFixed(1);
    const photoYShift = (options?.photoYShiftCm ?? -0.9).toFixed(1);
    const photoBlock =
      options?.showPhoto !== false
        ? `%--- PHOTO ---
\\begin{tikzpicture}[remember picture,overlay]
  \\node[
    anchor=north east,
    xshift=${photoXShift}cm,
    yshift=${photoYShift}cm
  ] at (current page.north east)
  {
    \\includegraphics[
      width=${photoWidth}cm,
      height=${photoWidth}cm,
      keepaspectratio,
      clip
    ]{profilepic.jpg}
  };
\\end{tikzpicture}`
        : `% Photo hidden by candidate customization`;

    // Experience Block
    let experienceLatex = '';
    if (options?.customExperiences && options.customExperiences.length > 0) {
      experienceLatex = options.customExperiences
        .map(
          (exp) => `  \\resumeSubheading
    {${exp.jobTitle}}{${exp.period}}
    {${exp.company}}%
    {${exp.portfolioUrl ? `\\href{${exp.portfolioUrl}}{\\textcolor{navymid}{View Portfolio}}` : ''}}
  \\bliststart
${exp.bullets.map((b) => `    \\resumeItem{${b.replace(/[—–]/g, ', ')}}`).join('\n')}
  \\blistend`
        )
        .join('\n\n');
    } else {
      experienceLatex = `  \\resumeSubheading
    {Marketing and Business Development}{shyamoli \\textbar{} Feb 2026 to Present}
    {DataIT Digital Solutions \\textbar{} datait.com.bd}%
    {\\href{https://drive.google.com/drive/folders/1rPkZXZZu2IjBwTLiyNlGxtBaAE6Ddtxz}%
    {\\textcolor{navymid}{View Portfolio}}}
  \\bliststart
    \\resumeItem{Oversee multi-brand marketing operations across DataIT and its
    sister companies, making independent decisions on content direction,
    campaign priorities and brand positioning across platforms.}
    \\resumeItem{Handle client-facing communication and stakeholder coordination,
    bridging requirements between management, software development teams and
    external partners to keep projects on track.}
    \\resumeItem{Lead competitor and market analysis to surface actionable
    business insights; present findings to leadership and contribute directly
    to strategic planning across multiple ventures in the group portfolio.}
    \\resumeItem{Drive end-to-end recruitment cycles including role scoping,
    candidate profiling, screening and evaluation; also manage customer data
    collection and sales tracking for group restaurant operations.}
  \\blistend

  \\resumeSubheading
    {Business Analytics }{Remote \\textbar{} 2025 June to 2026 Jan }
    {TechShilpo, Innovative Software Solutions}{techshilpo.com}
  \\bliststart
    \\resumeItem{Built Power BI and Excel dashboards for the Smart City initiative
    (Birganj City Care), optimising Ride Sharing and Home Delivery KPIs through
    user behaviour analysis.}
    \\resumeItem{Tracked audience trends and content engagement for
    \\textit{Alok Patrika} online newspaper; delivered editorial strategy insights
    and streamlined Power Query pipelines to cut weekly reporting time.}
  \\blistend`;
    }

    // Projects Block
    let projectsLatex = '';
    if (options?.customProjects && options.customProjects.length > 0) {
      projectsLatex = options.customProjects
        .map(
          (p) => `  \\resumeProject
    {${p.title}}%
    {${p.tools}}%
    {${p.url}}
  \\bliststart
${p.bullets.map((b) => `    \\resumeItem{${b.replace(/[—–]/g, ', ')}}`).join('\n')}
  \\blistend`
        )
        .join('\n\n');
    } else {
      projectsLatex = `  \\resumeProject
    {Data Professional Survey Dashboard}%
    {Power BI, DAX, Power Query \\textbar{} 2025}%
    {https://github.com/mdprince007/Data-Professional-survey-Powerbi}
  \\bliststart
    \\resumeItem{Analysed 630 professionals; Python ranked top language;
    salary satisfaction average \\textbf{5.86 out of 10}.}
  \\blistend

  \\resumeProject
    {Vrinda Store Annual Sales Report}%
    {Excel, Pivot Tables \\textbar{} 2025}%
    {https://github.com/mdprince007/Virinda_Store_Data_Analysis_2022}
  \\bliststart
    \\resumeItem{Revealed women aged 30 to 49 drive \\textbf{65\\,\\% of purchases};
    dynamic pivot table dashboard with customer segmentation.}
  \\blistend

  \\resumeProject
    {Kevin Cookie Company Sales Dashboard}%
    {Excel, Slicers, Charts \\textbar{} 2025}%
    {https://github.com/mdprince007/kevin-Cookie-Company}
  \\bliststart
    \\resumeItem{Global 2019 to 2020 sales dashboard with region and
    product-level drill-down via interactive slicers.}
  \\blistend

  \\resumeProject
    {Tamim Iqbal Cricket Performance Dashboard}%
    {Power BI \\textbar{} 2025}%
    {https://github.com/mdprince007/Tamim-Iqbal-Cricket-Dashboard}
  \\bliststart
    \\resumeItem{Career statistics across ODI, Test and T20 formats with
    dynamic year and format filters.}
  \\blistend`;
    }

    return `%==========================================================
% ATS-Friendly One-Page Resume  (Tailored for ${jobTitle} | ${company})
% Author : ${profile?.fullName || 'MD ASADUJJAMAN PRINCE'}
% Generated by CareerPilot AI Agent
%==========================================================
\\documentclass[letterpaper,10pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{tikz}
\\usepackage{graphicx}
\\usepackage{xcolor}
\\usepackage{array}
\\input{glyphtounicode}
\\pdfgentounicode=1

%==========================================================
% COLOURS
%==========================================================
\\definecolor{navydark}{HTML}{1B2E4B}
\\definecolor{navymid}{HTML}{2C4770}
\\definecolor{gold}{HTML}{B8972A}
\\definecolor{bodytext}{HTML}{1A1A1A}
\\definecolor{greydate}{HTML}{555555}
\\definecolor{tagbg}{HTML}{EDF1F7}

%==========================================================
% HYPERLINKS
%==========================================================
\\hypersetup{colorlinks=true, urlcolor=navymid, linkcolor=navymid}

%==========================================================
% MARGINS
%==========================================================
\\addtolength{\\oddsidemargin}{-0.55in}
\\addtolength{\\evensidemargin}{-0.55in}
\\addtolength{\\textwidth}{1.10in}
\\addtolength{\\topmargin}{-0.68in}
\\addtolength{\\textheight}{1.50in}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\setlength{\\parskip}{0pt}

%==========================================================
% SECTION HEADINGS
%==========================================================
\\titleformat{\\section}{%
  \\vspace{-5pt}\\scshape\\raggedright\\normalsize\\bfseries\\color{navymid}%
}{}{0em}{}[{\\color{gold}\\hrule height 0.8pt}\\vspace{-4pt}]

%==========================================================
% COMMANDS
%==========================================================

\\newcommand{\\resumeSubheading}[4]{%
  \\vspace{-1pt}\\item[]%
  \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}%
    \\textbf{\\small\\color{bodytext}#1} & \\textbf{\\small\\color{bodytext}#2}\\\\
    \\textit{\\small\\color{greydate}#3} & \\textit{\\small\\color{greydate}#4}%
  \\end{tabular*}\\vspace{-5pt}%
}

\\newcommand{\\resumeProject}[3]{%
  \\vspace{-1pt}\\item[]%
  \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}%
    \\textbf{\\small\\color{bodytext}#1}\\enspace\\small\\textcolor{greydate}{\\textit{#2}} &
    \\small\\href{#3}{\\textcolor{navymid}{[View]}}\\\\
  \\end{tabular*}\\vspace{-5pt}%
}

\\newcommand{\\resumeItem}[1]{%
  \\item\\small{\\color{bodytext}#1}\\vspace{-2pt}%
}

\\newcommand{\\bliststart}{%
  \\begin{itemize}[leftmargin=0.15in, label={},
                  noitemsep, topsep=1pt, parsep=0pt]%
}
\\newcommand{\\blistend}{\\end{itemize}\\vspace{-2pt}}

\\newcommand{\\stag}[1]{%
  {\\small\\colorbox{tagbg}{\\textcolor{navydark}{\\textbf{#1}}}}\\hspace{1pt}%
}

\\newcommand{\\certcell}[3]{%
  \\small\\textcolor{navymid}{\\faCheckSquare[regular]}\\enspace
  \\textbf{\\color{bodytext}#1}\\enspace
  \\textcolor{greydate}{#2}\\enspace
  \\href{#3}{\\textcolor{navymid}{[View]}}%
}

\\newcommand{\\certrow}[6]{%
  \\begin{tabular*}{\\textwidth}{@{}l@{\\extracolsep{\\fill}}l@{}}%
    \\certcell{#1}{#2}{#3} & \\certcell{#4}{#5}{#6}\\\\
  \\end{tabular*}\\vspace{2pt}%
}

%==========================================================
\\begin{document}
%==========================================================

${photoBlock}

%==========================================================
%  HEADER
%==========================================================
\\begin{center}
{\\fontsize{20pt}{22pt}\\selectfont\\textbf{\\color{navydark}${(profile?.fullName || 'MD ASADUJJAMAN PRINCE').toUpperCase()}}}\\\\[4pt]

{\\small\\color{bodytext}
\\faMapMarker*\\;\\textcolor{navymid}{Banashree, Dhaka}}\\\\[2pt]

{\\small\\color{bodytext}
\\href{tel:${profile?.phone || '+880 1611-939851'}}{\\faPhone\\;${profile?.phone || '+880 1611-939851'}}\\enspace
\\href{mailto:${profile?.email || 'mdprince.bd111@gmail.com'}}{\\faEnvelope\\;${profile?.email || 'mdprince.bd111@gmail.com'}}\\enspace
\\href{${profile?.linkedin || 'https://linkedin.com/in/mdasadujjamanprince'}}{\\faLinkedin\\;LinkedIn}\\enspace
\\href{${profile?.github || 'https://github.com/mdprince007'}}{\\faGithub\\;GitHub}
}
\\end{center}

\\vspace{-3pt}
{\\color{navydark}\\rule{\\textwidth}{1.6pt}}
\\vspace{-3pt}

%==========================================================
%  CAREER OBJECTIVE  (TAILORED FOR: ${jobTitle} | ${company})
%==========================================================
\\section{Career Objective}

\\small{
${objective}
}

%==========================================================
%  CORE SKILLS  (REORDERED FOR: ${jobTitle} | ${company})
%==========================================================
\\section{Core Skills}

\\vspace{3pt}
\\noindent
${skillsLatex}

%==========================================================
%  EDUCATION
%==========================================================
\\section{Education}
\\begin{itemize}[leftmargin=0in,label={}]
  \\resumeSubheading
    {${((profile as any)?.education?.[0] || (profile as any)?.educations?.[0])?.degree || 'Bachelor of Business Administration, Major in Management Information Systems'}}%
    {2021 to 2025}%
    {${((profile as any)?.education?.[0] || (profile as any)?.educations?.[0])?.institution || 'East West University, Dhaka, Bangladesh'}}%
    {CGPA: ${((profile as any)?.education?.[0] || (profile as any)?.educations?.[0])?.cgpa || '3.55'} / 4.00}
\\end{itemize}
\\vspace{-6pt}

%==========================================================
%  EXPERIENCE
%==========================================================
\\section{Experience}
\\begin{itemize}[leftmargin=0in,label={}]

${experienceLatex}

\\end{itemize}
\\vspace{-6pt}

%==========================================================
%  KEY PROJECTS
%==========================================================
\\section{Key Projects}
\\begin{itemize}[leftmargin=0in,label={}]

${projectsLatex}

\\end{itemize}
\\vspace{-6pt}

%==========================================================
%  CERTIFICATIONS
%==========================================================
\\section{Certifications}
\\vspace{3pt}

\\certrow%
  {Business Analytics with Excel}%
  {Simplilearn, Jul 2025}%
  {https://simpli-web.app.link/e/iu8bwUMbIYb}%
  {Intro to Generative AI Studio}%
  {Simplilearn, Jun 2025}%
  {https://simpli-web.app.link/e/SvjLALJbiXb}

\\certrow%
  {Introduction to Prompt Engineering}%
  {Simplilearn, Jun 2025}%
  {https://simpli-web.app.link/e/j8JaxBxaiXb}%
  {Trello for Beginners}%
  {Coursera, Sep 2025}%
  {https://www.coursera.org/account/accomplishments/verify/K5T6AKP3WHTD}

\\vspace{-4pt}

%==========================================================
%  EXTRACURRICULAR
%==========================================================
\\section{Extracurricular}
\\vspace{2pt}
\\noindent\\small%
\\textbf{\\color{bodytext}Volunteer, EWU Debate Club}\\enspace
\\textcolor{greydate}{National Competition SPREE 2022 \\textbar{}
East West University, Dhaka \\textbar{} 2022 \\textbar{}
Managed event logistics and coordination for a national inter-university
debate competition.}

\\end{document}
`;
  }
}
