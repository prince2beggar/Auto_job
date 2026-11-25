import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AI Job Hunting Agent database...');

  // 1. Clean existing records
  await prisma.notification.deleteMany();
  await prisma.applicationEvent.deleteMany();
  await prisma.application.deleteMany();
  await prisma.emailDraft.deleteMany();
  await prisma.coverLetter.deleteMany();
  await prisma.cVSVersion?.deleteMany?.().catch(() => {});
  await prisma.cVVersion.deleteMany();
  await prisma.masterCV.deleteMany();
  await prisma.jobMatch.deleteMany();
  await prisma.governmentCircular.deleteMany();
  await prisma.job.deleteMany();
  await prisma.careerPreference.deleteMany();
  await prisma.project.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create User
  const user = await prisma.user.create({
    data: {
      email: 'mdprince.bd111@gmail.com',
      name: 'MD ASADUJJAMAN PRINCE',
    },
  });

  // 3. Create UserProfile
  const profile = await prisma.userProfile.create({
    data: {
      userId: user.id,
      fullName: 'MD ASADUJJAMAN PRINCE',
      email: 'mdprince.bd111@gmail.com',
      phone: '+880 1611-939851',
      country: 'Bangladesh',
      city: 'Banashree, Dhaka',
      address: 'Banashree, Dhaka, Bangladesh',
      linkedin: 'https://linkedin.com/in/mdasadujjamanprince',
      github: 'https://github.com/mdprince007',
      currentStatus: 'Marketing & Business Analytics Professional',
      yearsOfExperience: 1.0,
      bio: 'Experienced in supporting business operations, coordinating with teams, and handling day-to-day responsibilities in a dynamic startup environment. Enjoy taking ownership of tasks, solving problems, and keeping projects organized. Seeking an opportunity to contribute to business growth while developing leadership and operational expertise.',
      completionPercentage: 100,
      missingFields: JSON.stringify([]),
    },
  });

  // 4. Education
  await prisma.education.create({
    data: {
      profileId: profile.id,
      degree: 'Bachelor of Business Administration, Major in Management Information Systems',
      major: 'Management Information Systems (MIS)',
      institution: 'East West University, Dhaka, Bangladesh',
      graduationYear: 2025,
      cgpa: '3.55 / 4.00',
      provenance: 'EXTRACTED',
    },
  });

  // 5. Experience
  await prisma.experience.createMany({
    data: [
      {
        profileId: profile.id,
        jobTitle: 'Marketing and Business Development',
        company: 'DataIT Digital Solutions (datait.com.bd)',
        location: 'Shyamoli, Dhaka',
        employmentType: 'Full-time',
        startDate: 'Feb 2026',
        endDate: 'Present',
        isCurrent: true,
        responsibilities: JSON.stringify([
          'Oversee multi-brand marketing operations across DataIT and its sister companies, making independent decisions on content direction, campaign priorities and brand positioning across platforms.',
          'Handle client-facing communication and stakeholder coordination, bridging requirements between management, software development teams and external partners to keep projects on track.',
          'Lead competitor and market analysis to surface actionable business insights; present findings to leadership and contribute directly to strategic planning across multiple ventures in the group portfolio.',
          'Drive end-to-end recruitment cycles including role scoping, candidate profiling, screening and evaluation; also manage customer data collection and sales tracking for group restaurant operations.'
        ]),
        achievements: JSON.stringify([
          'Managed end-to-end stakeholder coordination bridging management and dev squads.',
          'Directed multi-brand marketing strategy across multiple portfolio ventures.'
        ]),
        technologies: JSON.stringify(['Business Operations', 'Market Research', 'Project Coordination', 'Stakeholder Communication']),
        provenance: 'EXTRACTED',
      },
      {
        profileId: profile.id,
        jobTitle: 'Business Analytics',
        company: 'TechShilpo, Innovative Software Solutions (techshilpo.com)',
        location: 'Remote',
        employmentType: 'Contract',
        startDate: 'Jun 2025',
        endDate: 'Jan 2026',
        isCurrent: false,
        responsibilities: JSON.stringify([
          'Built Power BI and Excel dashboards for the Smart City initiative (Birganj City Care), optimising Ride Sharing and Home Delivery KPIs through user behaviour analysis.',
          'Tracked audience trends and content engagement for Alok Patrika online newspaper; delivered editorial strategy insights and streamlined Power Query pipelines to cut weekly reporting time.'
        ]),
        achievements: JSON.stringify([
          'Optimized ride sharing and home delivery KPIs through user behavior analysis.',
          'Streamlined Power Query pipelines to cut weekly reporting time.'
        ]),
        technologies: JSON.stringify(['Power BI', 'Excel', 'DAX', 'Power Query', 'Data Analysis']),
        provenance: 'EXTRACTED',
      },
    ],
  });

  // 6. Skills
  const initialSkills = [
    { name: 'Business Operations', category: 'BUSINESS', provenance: 'EXTRACTED' },
    { name: 'Project Coordination', category: 'BUSINESS', provenance: 'EXTRACTED' },
    { name: 'Client Coordination', category: 'BUSINESS', provenance: 'EXTRACTED' },
    { name: 'Market Research', category: 'BUSINESS', provenance: 'EXTRACTED' },
    { name: 'Business Development', category: 'BUSINESS', provenance: 'EXTRACTED' },
    { name: 'Social Media Management', category: 'BUSINESS', provenance: 'EXTRACTED' },
    { name: 'Content Planning', category: 'BUSINESS', provenance: 'EXTRACTED' },
    { name: 'Stakeholder Communication', category: 'SOFT', provenance: 'EXTRACTED' },
    { name: 'Documentation', category: 'BUSINESS', provenance: 'EXTRACTED' },
    { name: 'Microsoft Excel', category: 'SOFTWARE', provenance: 'EXTRACTED' },
    { name: 'Data Analysis', category: 'TECHNICAL', provenance: 'EXTRACTED' },
    { name: 'Problem Solving', category: 'SOFT', provenance: 'EXTRACTED' },
    { name: 'Team Collaboration', category: 'SOFT', provenance: 'EXTRACTED' },
    { name: 'Time Management', category: 'SOFT', provenance: 'EXTRACTED' },
    { name: 'Adaptability', category: 'SOFT', provenance: 'EXTRACTED' },
    { name: 'Power BI', category: 'SOFTWARE', provenance: 'EXTRACTED' },
    { name: 'SQL', category: 'TECHNICAL', provenance: 'EXTRACTED' },
    { name: 'Python', category: 'TECHNICAL', provenance: 'EXTRACTED' },
  ];

  for (const s of initialSkills) {
    await prisma.skill.create({
      data: {
        profileId: profile.id,
        name: s.name,
        category: s.category,
        provenance: s.provenance,
        confidence: 0.98,
      },
    });
  }

  // 7. Projects
  await prisma.project.createMany({
    data: [
      {
        profileId: profile.id,
        name: 'Data Professional Survey Dashboard',
        description: 'Analysed 630 professionals; Python ranked top language; salary satisfaction average 5.86 out of 10.',
        tools: JSON.stringify(['Power BI', 'DAX', 'Power Query']),
        outcome: 'Comprehensive compensation and tool popularity insights across 630 respondents.',
        repoUrl: 'https://github.com/mdprince007/Data-Professional-survey-Powerbi',
      },
      {
        profileId: profile.id,
        name: 'Vrinda Store Annual Sales Report',
        description: 'Revealed women aged 30 to 49 drive 65% of purchases; dynamic pivot table dashboard with customer segmentation.',
        tools: JSON.stringify(['Excel', 'Pivot Tables']),
        outcome: 'Identified core customer segment driving 65% of revenue.',
        repoUrl: 'https://github.com/mdprince007/Virinda_Store_Data_Analysis_2022',
      },
      {
        profileId: profile.id,
        name: 'Kevin Cookie Company Sales Dashboard',
        description: 'Global 2019 to 2020 sales dashboard with region and product-level drill-down via interactive slicers.',
        tools: JSON.stringify(['Excel', 'Slicers', 'Charts']),
        outcome: 'Interactive product-level revenue breakdown across global territories.',
        repoUrl: 'https://github.com/mdprince007/kevin-Cookie-Company',
      },
      {
        profileId: profile.id,
        name: 'Tamim Iqbal Cricket Performance Dashboard',
        description: 'Career statistics across ODI, Test and T20 formats with dynamic year and format filters.',
        tools: JSON.stringify(['Power BI', 'DAX']),
        outcome: 'Complete career metric analytics across multi-format cricket matches.',
        repoUrl: 'https://github.com/mdprince007/Tamim-Iqbal-Cricket-Dashboard',
      },
    ],
  });

  // 8. Certifications
  await prisma.certification.createMany({
    data: [
      {
        profileId: profile.id,
        name: 'Business Analytics with Excel',
        issuer: 'Simplilearn, Jul 2025',
        credentialUrl: 'https://simpli-web.app.link/e/iu8bwUMbIYb',
      },
      {
        profileId: profile.id,
        name: 'Intro to Generative AI Studio',
        issuer: 'Simplilearn, Jun 2025',
        credentialUrl: 'https://simpli-web.app.link/e/SvjLALJbiXb',
      },
      {
        profileId: profile.id,
        name: 'Introduction to Prompt Engineering',
        issuer: 'Simplilearn, Jun 2025',
        credentialUrl: 'https://simpli-web.app.link/e/j8JaxBxaiXb',
      },
      {
        profileId: profile.id,
        name: 'Trello for Beginners',
        issuer: 'Coursera, Sep 2025',
        credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/K5T6AKP3WHTD',
      },
    ],
  });

  // 8. Career Preferences
  await prisma.careerPreference.create({
    data: {
      profileId: profile.id,
      targetTitles: JSON.stringify([
        'Business Analyst',
        'Data Analyst',
        'Business Intelligence Analyst',
        'Associate Product Manager',
      ]),
      targetIndustries: JSON.stringify(['Technology', 'FinTech', 'Telecommunications', 'FMCG']),
      experienceLevel: 'Entry Level (0-1 yrs)',
      jobTypes: JSON.stringify(['Full-time', 'Internship', 'Trainee']),
      locations: JSON.stringify(['Dhaka', 'Remote']),
      remotePreference: 'Flexible',
      minSalary: 35000,
      currency: 'BDT',
      salaryNegotiable: true,
      preferredOrgTypes: JSON.stringify(['Private', 'Government', 'MNC', 'Startup']),
      naturalLanguageGoal:
        'I am looking for Business Analyst, Data Analyst, Business Intelligence, Product, or Marketing entry-level jobs. I am a BBA graduate with 0-1 year experience. I prefer Dhaka or remote jobs and want full-time or internship opportunities with at least 35,000 BDT.',
    },
  });

  // 9. Master CV
  const sampleCvText = `MD ASADUJJAMAN PRINCE
Banashree, Dhaka | +880 1611-939851 | mdprince.bd111@gmail.com
LinkedIn: linkedin.com/in/mdasadujjamanprince | GitHub: github.com/mdprince007

CAREER OBJECTIVE
Experienced in supporting business operations, coordinating with teams, and handling day-to-day responsibilities in a dynamic startup environment. Proven background in business analytics, Power BI dashboard development, and digital marketing execution.

EDUCATION
East West University, Dhaka, Bangladesh
Bachelor of Business Administration, Major in Management Information Systems
2021 to 2025 | CGPA: 3.55 / 4.00

EXPERIENCE
DataIT Digital Solutions | datait.com.bd
Marketing and Business Development (shyamoli | Feb 2026 to Present)
• Oversee multi-brand marketing operations across DataIT and sister companies, making independent decisions on campaign priorities and brand positioning.
• Handle client-facing communication and stakeholder coordination, bridging requirements between management and software development teams.
• Lead competitor and market analysis to surface actionable business insights; present findings to leadership.
• Drive end-to-end recruitment cycles and manage customer data collection and sales tracking.

TechShilpo, Innovative Software Solutions | techshilpo.com
Business Analytics (Remote | 2025 June to 2026 Jan)
• Built Power BI and Excel dashboards for the Smart City initiative (Birganj City Care), optimising Ride Sharing and Home Delivery KPIs.
• Tracked audience trends and content engagement for Alok Patrika online newspaper; streamlined Power Query pipelines.

CORE SKILLS
Power BI, Advanced Excel, DAX, Power Query, Data Analysis, SQL, Python, Business Analytics, Project Management, Digital Marketing, Market Research, Communication

KEY PROJECTS
• Data Professional Survey Dashboard (Power BI, DAX, Power Query | 2025): Analysed 630 professionals; Python ranked top language; salary satisfaction average 5.86 out of 10.
• Vrinda Store Annual Sales Report (Excel, Pivot Tables | 2025): Revealed women aged 30 to 49 drive 65% of purchases; dynamic pivot table dashboard with customer segmentation.
• Kevin Cookie Company Sales Dashboard (Excel, Slicers, Charts | 2025): Global 2019 to 2020 sales dashboard with region and product-level drill-down via interactive slicers.
• Tamim Iqbal Cricket Performance Dashboard (Power BI | 2025): Career statistics across ODI, Test and T20 formats with dynamic year and format filters.

CERTIFICATIONS
• Business Analytics with Excel (Simplilearn, Jul 2025)
• Intro to Generative AI Studio (Simplilearn, Jun 2025)
• Introduction to Prompt Engineering (Simplilearn, Jun 2025)
• Trello for Beginners (Coursera, Sep 2025)

EXTRACURRICULAR
Volunteer, EWU Debate Club — National Competition SPREE 2022 | East West University, Dhaka | 2022`;

  const masterCv = await prisma.masterCV.create({
    data: {
      profileId: profile.id,
      originalFilename: 'Md_Asadujjaman_Prince_CV.pdf',
      fileType: 'application/pdf',
      filePath: 'storage/cvs/Md_Asadujjaman_Prince_CV.pdf',
      rawText: sampleCvText,
      isDefault: true,
    },
  });

  // 10. Jobs
  const now = new Date();
  const d1 = new Date(now.getTime() + 18 * 3600 * 1000); // 18 hours (URGENT)
  const d2 = new Date(now.getTime() + 2.5 * 24 * 3600 * 1000); // 2.5 days (HIGH)
  const d3 = new Date(now.getTime() + 6 * 24 * 3600 * 1000); // 6 days (MEDIUM)
  const d4 = new Date(now.getTime() + 14 * 24 * 3600 * 1000); // 14 days (NORMAL)

  // Job 1: bKash (Private - High Match 94%)
  const job1 = await prisma.job.create({
    data: {
      source: 'Bdjobs',
      sourceUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1184920',
      jobType: 'PRIVATE',
      title: 'Junior Business Analyst (FinTech)',
      company: 'bKash Limited',
      organizationType: 'Private / MFS',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'Dhaka (Shadhinata Tower)',
      remoteType: 'Hybrid',
      employmentType: 'Full-time',
      description:
        'bKash is seeking an analytical Junior Business Analyst to join our Product & Commercial Analytics unit. You will collaborate with cross-functional teams to translate customer transactional patterns into actionable operational insights.',
      responsibilities: JSON.stringify([
        'Gather and document detailed business and technical requirements from product owners',
        'Create and maintain automated Power BI and Excel dashboards for daily MFS metrics',
        'Conduct SQL queries against data marts to investigate user drop-offs and retention trends',
        'Participate in sprint grooming and user acceptance testing (UAT)',
      ]),
      requirements: JSON.stringify([
        'BBA in MIS, Finance, Business Analytics, or BSc in CSE / Data Science from a reputed university',
        '0 to 1 year of professional or internship experience in data analytics or business analysis',
        'Demonstrated proficiency in Microsoft Excel (Lookups, Pivot, Formulas) and Power BI',
        'Fundamental understanding of SQL query structure',
      ]),
      preferredRequirements: JSON.stringify([
        'Basic Python data manipulation (pandas)',
        'Experience with Agile / Scrum ceremonies',
      ]),
      educationRequirements: 'BBA in MIS / Business Analytics / Finance',
      experienceRequirements: '0-1 year (Fresh graduates with internship experience encouraged)',
      requiredSkills: JSON.stringify(['Business Analysis', 'Power BI', 'Microsoft Excel (Advanced)', 'SQL']),
      preferredSkills: JSON.stringify(['Python', 'UAT Testing', 'Agile']),
      salary: '45,000 - 55,000 BDT/month',
      minSalary: 45000,
      maxSalary: 55000,
      currency: 'BDT',
      applicationDeadline: d2,
      applicationStartDate: now,
      applicationMethod: 'EMAIL',
      recruiterEmail: 'careers.analytics@bkash.com',
      applicationUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1184920',
      status: 'ACTIVE',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job1.id,
      overallScore: 94,
      educationScore: 96,
      experienceScore: 95,
      skillsScore: 92,
      roleScore: 96,
      locationScore: 95,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: Your BBA in MIS degree matches the education requirement. Your 6-month internship satisfies the 0-1 year experience criterion.',
      matchReasons: JSON.stringify([
        'Your BBA degree in MIS from East West University matches the target qualification.',
        'Core skills overlap: Power BI, Excel, SQL, and Business Analysis are directly aligned.',
        'Your internship experience at FinTech Innovations matches the MFS business domain.',
        'Position is based in Dhaka with flexible hybrid work.',
      ]),
      gaps: JSON.stringify(['Agile / Scrum framework familiarity is preferred.']),
      urgencyLevel: 'HIGH',
    },
  });

  // Job 2: Bangladesh Bank (Government - High Match 91%)
  const job2 = await prisma.job.create({
    data: {
      source: 'Official Circular (Bangladesh Bank)',
      sourceUrl: 'https://erecruitment.bb.org.bd/onlineapp/jobdetails.php?id=1024',
      jobType: 'GOVERNMENT',
      title: 'Assistant Director (General)',
      company: 'Bangladesh Bank',
      organizationType: 'Government / Central Bank',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'Motijheel, Dhaka',
      remoteType: 'On-site',
      employmentType: 'Full-time',
      description:
        'Bangladesh Bank invites applications from eligible Bangladeshi citizens for the post of Assistant Director (General). Recruited officers will engage in monetary policy implementation, banking regulation, foreign exchange reserve supervision, and economic data research.',
      responsibilities: JSON.stringify([
        'Audit and inspect scheduled commercial bank financial compliance reports',
        'Analyze financial statement data and macroeconomic indicators',
        'Prepare policy briefs and statistical summaries for governor memos',
      ]),
      requirements: JSON.stringify([
        'Four-year Bachelor or Master degree in BBA, Economics, Finance, Banking, Statistics',
        'At least two first divisions/classes or equivalent CGPA in academic results',
        'Age strictly between 21 and 30 years as on circular date',
      ]),
      educationRequirements: '4-year BBA / Honors in Economics, Finance, Statistics, or Management',
      experienceRequirements: 'No prior work experience required (Entry-level Cadre equivalent)',
      requiredSkills: JSON.stringify(['Business Analysis', 'Microsoft Excel (Advanced)', 'Data Visualization', 'Critical Thinking']),
      preferredSkills: JSON.stringify(['Economics Analysis', 'Statistical Modeling']),
      salary: 'Grade 9: 22,000 - 53,060 BDT (National Pay Scale + Allowances ~ 45,000 BDT)',
      minSalary: 42000,
      maxSalary: 55000,
      currency: 'BDT',
      applicationDeadline: d3,
      applicationStartDate: now,
      applicationMethod: 'GOVERNMENT_PORTAL',
      applicationUrl: 'https://erecruitment.bb.org.bd/onlineapp/jobdetails.php?id=1024',
      status: 'ACTIVE',
    },
  });

  await prisma.governmentCircular.create({
    data: {
      jobId: job2.id,
      recruitingOrganization: 'Bangladesh Bank',
      ministry: 'Bank and Financial Institutions Division, Ministry of Finance',
      postTitle: 'Assistant Director (General)',
      vacancies: 100,
      educationalQualification: '4-year Bachelor degree in BBA / Economics / Finance / Statistics',
      acceptedDegrees: JSON.stringify(['BBA', 'Economics', 'Finance', 'Statistics', 'CSE']),
      requiredExperience: 'No prior experience required',
      ageLimit: '21 to 30 years (32 for Quota)',
      maxAge: 30,
      quotaAgeLimit: 32,
      quotaInformation: 'Freedom fighter descendants (32 yrs), Ethnic minority (32 yrs)',
      districtEligibility: 'Candidates from all districts of Bangladesh are eligible',
      applicationFee: '200 BDT',
      paymentMethod: 'Rocket / bKash via e-Recruitment Portal',
      circularNumber: 'BB/HRD-1(Rect.)/2026-441',
      circularPdfUrl: 'https://erecruitment.bb.org.bd/circular/ad_general_2026.pdf',
      applicationWebsite: 'https://erecruitment.bb.org.bd',
      preliminaryExam: 'MCQ Preliminary Examination (100 marks)',
      writtenExam: 'Written Test: Bangla, English, Mathematics, General Knowledge (200 marks)',
      vivaExam: 'Viva Voce (25 marks)',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job2.id,
      overallScore: 91,
      educationScore: 100,
      experienceScore: 100,
      skillsScore: 82,
      roleScore: 85,
      locationScore: 95,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: Candidate holds a 4-year BBA degree (accepted qualification). Candidate age (~23 years) is well within the 30-year limit. No prior cadre experience is required.',
      matchReasons: JSON.stringify([
        'BBA degree directly satisfies the eligible qualifications for Assistant Director (General).',
        'No prior work experience is required for this entry-level Grade 9 cadre role.',
        'High vacancy count (100 posts) presents strong selection opportunity.',
        'Official circular verified and accessible directly via e-recruitment portal.',
      ]),
      gaps: JSON.stringify(['Requires preliminary preparation in General Knowledge and Math.']),
      urgencyLevel: 'MEDIUM',
    },
  });

  // Job 3: Pathao (Urgent - 18h left! 90% Match)
  const job3 = await prisma.job.create({
    data: {
      source: 'Bdjobs',
      sourceUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1185301',
      jobType: 'PRIVATE',
      title: 'Data & BI Analyst - Operations',
      company: 'Pathao Limited',
      organizationType: 'Private / Tech Startup',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'Gulshan-1, Dhaka',
      remoteType: 'On-site',
      employmentType: 'Full-time',
      description:
        'Pathao is looking for an energetic Data & BI Analyst to support logistics and ride-sharing operations. You will build KPI reports, optimize delivery routes, and provide daily metric briefings.',
      responsibilities: JSON.stringify([
        'Build daily operational tracking reports for fleet and merchant performance',
        'Cleanse and structure raw operational logs using SQL and Excel',
        'Visualize core business metrics in Power BI and Google Data Studio',
      ]),
      requirements: JSON.stringify([
        'Bachelor degree in Business Administration, Statistics, Economics, or CSE',
        'Strong command of Power BI, Excel, and SQL',
        '0-1 year relevant experience',
      ]),
      educationRequirements: 'BBA / BSc in quantitative field',
      experienceRequirements: '0-1 year experience',
      requiredSkills: JSON.stringify(['Power BI', 'SQL', 'Microsoft Excel (Advanced)', 'Data Visualization']),
      preferredSkills: JSON.stringify(['Google Data Studio', 'Problem Solving']),
      salary: '40,000 - 50,000 BDT/month',
      minSalary: 40000,
      maxSalary: 50000,
      currency: 'BDT',
      applicationDeadline: d1, // URGENT
      applicationStartDate: now,
      applicationMethod: 'EMAIL',
      recruiterEmail: 'talent@pathao.com',
      applicationUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1185301',
      status: 'ACTIVE',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job3.id,
      overallScore: 90,
      educationScore: 95,
      experienceScore: 92,
      skillsScore: 94,
      roleScore: 90,
      locationScore: 90,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: Your degree and technical skills in Power BI and SQL fulfill all requirements.',
      matchReasons: JSON.stringify([
        'Application deadline is urgent (within 24 hours).',
        'Direct email application supported for fast submission.',
        'High technical skill match: Power BI, SQL, and Excel are all verified in your profile.',
      ]),
      gaps: JSON.stringify(['Experience with ride-hailing datasets is an asset.']),
      urgencyLevel: 'URGENT',
    },
  });

  // Job 4: Grameenphone Internship (Internship - 89% Match)
  const job4 = await prisma.job.create({
    data: {
      source: 'Corporate Careers',
      sourceUrl: 'https://www.grameenphone.com/about/careers/internship-program/apply/bi-analytics-2026',
      jobType: 'INTERNSHIP',
      title: 'Business Intelligence & Commercial Analytics Intern',
      company: 'Grameenphone Limited (Telenor Group)',
      organizationType: 'MNC / Telecom',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'GPHouse, Bashundhara R/A, Dhaka',
      remoteType: 'Hybrid',
      employmentType: 'Internship',
      description:
        'Grameenphone invites high-potential fresh graduate candidates for a 6-month intensive Commercial Analytics & BI Internship. You will work on massive subscriber datasets, consumer churn prediction, and digital service adoption analytics.',
      responsibilities: JSON.stringify([
        'Assist senior data analysts in tracking daily active users and ARPU across subscriber clusters',
        'Develop visualization dashboards using Power BI and Microsoft Excel',
        'Execute exploratory SQL queries to segment customer bundles and offer conversions',
      ]),
      requirements: JSON.stringify([
        'Fresh graduate in BBA (MIS / Finance / Marketing) or BSc CSE',
        'Good knowledge of Excel, data visualization, and basic SQL',
        'Proactive learner with passion for telecommunications analytics',
      ]),
      educationRequirements: 'Fresh graduate in BBA (MIS/Finance) or BSc CSE',
      experienceRequirements: '0 years (Fresh graduates strictly encouraged)',
      requiredSkills: JSON.stringify(['Power BI', 'Microsoft Excel (Advanced)', 'Business Analysis', 'Data Visualization']),
      preferredSkills: JSON.stringify(['SQL', 'Python']),
      salary: '25,000 BDT/month (Paid Internship + Transport & dining benefits)',
      minSalary: 25000,
      maxSalary: 25000,
      currency: 'BDT',
      applicationDeadline: d3,
      applicationStartDate: now,
      applicationMethod: 'EMAIL',
      recruiterEmail: 'careers.internship@grameenphone.com',
      applicationUrl: 'https://www.grameenphone.com/about/careers/internship-program/apply/bi-analytics-2026',
      status: 'ACTIVE',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job4.id,
      overallScore: 89,
      educationScore: 98,
      experienceScore: 98,
      skillsScore: 90,
      roleScore: 90,
      locationScore: 90,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: You are a recent BBA graduate with strong analytical foundations.',
      matchReasons: JSON.stringify([
        'Designed specifically for fresh BBA graduates.',
        'Direct experience with Power BI and customer retention aligns with telecom analytics.',
        'High prestige telecom multinational with excellent full-time conversion opportunities.',
      ]),
      gaps: JSON.stringify([]),
      urgencyLevel: 'MEDIUM',
    },
  });

  // Job 5: BAT Global Graduate (Trainee - 87% Match)
  const job5 = await prisma.job.create({
    data: {
      source: 'Corporate Careers',
      sourceUrl: 'https://careers.bat.com/job/Dhaka-Global-Graduate-Commercial-Analytics-1200/1098471201/',
      jobType: 'TRAINEE',
      title: 'Global Graduate Trainee - Business Analytics',
      company: 'British American Tobacco (BAT Bangladesh)',
      organizationType: 'MNC / FMCG',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'Mohakhali, Dhaka',
      remoteType: 'On-site',
      employmentType: 'Trainee',
      description:
        'The BAT Global Graduate Programme is an accelerated 18-month management trainee track designed to develop future business leaders. You will rotate across commercial analytics, operations planning, and strategic trade marketing.',
      responsibilities: JSON.stringify([
        'Lead analytical projects optimizing supply distribution metrics and inventory logistics',
        'Build end-to-end data pipelines and visualization models for senior leadership reviews',
      ]),
      requirements: JSON.stringify([
        'Graduated within the last 1 year with a Bachelor in Business Administration (BBA) or MBA',
        'CGPA 3.30 or above',
        '0 to 1 year of total work or internship experience',
      ]),
      educationRequirements: 'BBA / MBA graduate (CGPA >= 3.30)',
      experienceRequirements: '0-1 year (Freshers and recent graduates)',
      requiredSkills: JSON.stringify(['Business Analysis', 'Critical Thinking', 'Stakeholder Communication', 'Microsoft Excel (Advanced)']),
      preferredSkills: JSON.stringify(['Power BI', 'Project Management']),
      salary: '85,000 - 110,000 BDT/month (Management Trainee scale)',
      minSalary: 85000,
      maxSalary: 110000,
      currency: 'BDT',
      applicationDeadline: d4,
      applicationStartDate: now,
      applicationMethod: 'COMPANY_PORTAL',
      applicationUrl: 'https://careers.bat.com/job/Dhaka-Global-Graduate-Commercial-Analytics-1200/1098471201/',
      recruiterEmail: 'bat_bangladesh_recruitment@bat.com',
      status: 'ACTIVE',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job5.id,
      overallScore: 87,
      educationScore: 95,
      experienceScore: 90,
      skillsScore: 85,
      roleScore: 88,
      locationScore: 90,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: Your CGPA (3.55) exceeds the required 3.30 threshold, and graduation year (2025) is within 1 year.',
      matchReasons: JSON.stringify([
        'Candidate CGPA 3.55 qualifies for high-bar BAT academic standard (minimum 3.30).',
        'Fast-track leadership development program offering industry-leading compensation.',
      ]),
      gaps: JSON.stringify(['High competition level; strong interview preparation required.']),
      urgencyLevel: 'NORMAL',
    },
  });

  // Job 6: BRAC Bank Young Leaders Program (Management Trainee - Banking & Analytics)
  const job6 = await prisma.job.create({
    data: {
      source: 'Bdjobs',
      sourceUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1187450',
      jobType: 'TRAINEE',
      title: 'Young Leaders Program (Management Trainee - Banking & Analytics)',
      company: 'BRAC Bank PLC',
      organizationType: 'Banking & Financial Services',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'Anik Tower, Gulshan-1, Dhaka',
      remoteType: 'On-site',
      employmentType: 'Trainee',
      description:
        'BRAC Bank is hunting for exceptional talent for its flagship Young Leaders Program (YLP). Management trainees will rotate through retail banking analytics, credit risk modeling, corporate banking, and digital banking channels.',
      responsibilities: JSON.stringify([
        'Rotate across credit risk, treasury, retail banking, and analytics squads',
        'Analyze branch transaction volumes and digital payment telemetry using Excel & Power BI',
        'Deliver quarterly business performance reports to senior management',
      ]),
      requirements: JSON.stringify([
        '4-year Bachelor or Master degree in BBA, MBA, Economics, Finance, Statistics, or CSE',
        'Minimum CGPA 3.00 out of 4.00 (or equivalent)',
        '0 to 1 year experience (Fresh graduates encouraged)',
      ]),
      educationRequirements: '4-year BBA / MBA / Economics / Statistics / CSE',
      experienceRequirements: '0-1 year (Freshers & postgraduates eligible)',
      requiredSkills: JSON.stringify(['Business Analysis', 'Microsoft Excel (Advanced)', 'Financial Analysis', 'Communication']),
      preferredSkills: JSON.stringify(['Power BI', 'Credit Risk Modeling', 'Presentation Skills']),
      salary: '75,000 - 85,000 BDT/month (Permanent Senior Officer scale post-training)',
      minSalary: 75000,
      maxSalary: 85000,
      currency: 'BDT',
      applicationDeadline: d4,
      applicationStartDate: now,
      applicationMethod: 'BDJOBS',
      applicationUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1187450',
      recruiterEmail: 'recruitment@bracbank.com',
      status: 'ACTIVE',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job6.id,
      overallScore: 92,
      educationScore: 96,
      experienceScore: 95,
      skillsScore: 90,
      roleScore: 92,
      locationScore: 95,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: Your 4-year BBA degree with 3.55 CGPA matches the qualification criteria, and you are within the 0-1 year fresh graduate bracket.',
      matchReasons: JSON.stringify([
        'BBA MIS degree matches the banking analytics and digital channel track.',
        'High CGPA (3.55) satisfies the YLP academic cut-off.',
        'Prestigious fast-track career program with accelerated promotion to Senior Officer.',
      ]),
      gaps: JSON.stringify(['Basic understanding of banking products & SME credit recommended.']),
      urgencyLevel: 'NORMAL',
    },
  });

  // Job 7: The City Bank Limited - Probationary Officer (Cash & General Banking)
  const job7 = await prisma.job.create({
    data: {
      source: 'Bdjobs',
      sourceUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1188120',
      jobType: 'PRIVATE',
      title: 'Probationary Officer (General Banking & Retail Operations)',
      company: 'The City Bank Limited',
      organizationType: 'Banking & Financial Services',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'City Bank Center, Gulshan-2, Dhaka',
      remoteType: 'On-site',
      employmentType: 'Full-time',
      description:
        'The City Bank Limited is inviting applications for the position of Probationary Officer. Successful candidates will manage daily branch banking operations, customer account onboarding, credit card servicing, and AML compliance.',
      responsibilities: JSON.stringify([
        'Supervise daily cash management, clearing transactions, and general ledger reconciliation',
        'Ensure rigorous KYC/AML compliance during customer onboarding',
        'Cross-sell retail asset and liability products to high-net-worth clients',
      ]),
      requirements: JSON.stringify([
        'Bachelor or Master degree in BBA, MBA, M.Com, Economics, or related disciplines from a recognized university',
        'No 3rd division/class in academic career',
        'Fresh graduates (0 years experience strictly preferred)',
      ]),
      educationRequirements: 'BBA / MBA / M.Com / Master degree in any discipline',
      experienceRequirements: '0 years (Freshers strictly encouraged)',
      requiredSkills: JSON.stringify(['General Banking', 'Customer Relationship', 'Microsoft Excel (Advanced)', 'Communication']),
      preferredSkills: JSON.stringify(['Financial Accounting', 'AML Compliance']),
      salary: '55,000 - 65,000 BDT/month (On probation ~ 48,000 BDT)',
      minSalary: 55000,
      maxSalary: 65000,
      currency: 'BDT',
      applicationDeadline: d3,
      applicationStartDate: now,
      applicationMethod: 'BDJOBS',
      applicationUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1188120',
      recruiterEmail: 'career@thecitybank.com',
      status: 'ACTIVE',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job7.id,
      overallScore: 88,
      educationScore: 94,
      experienceScore: 100,
      skillsScore: 82,
      roleScore: 85,
      locationScore: 95,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: Your BBA degree fulfills all educational standards and fresh graduate status satisfies the entry criteria.',
      matchReasons: JSON.stringify([
        'BBA degree directly qualifies for commercial bank Probationary Officer entry.',
        'No prior banking experience needed; 1-year training provided by City Bank Academy.',
        'Convenient Dhaka headquarters and prime branch placement.',
      ]),
      gaps: JSON.stringify(['Preparation in banking math and English comprehension needed.']),
      urgencyLevel: 'MEDIUM',
    },
  });

  // Job 8: Unilever Bangladesh - Future Leaders Programme (UFLP)
  const job8 = await prisma.job.create({
    data: {
      source: 'Corporate Careers',
      sourceUrl: 'https://careers.unilever.com/job/dhaka/management-trainee-uflp/34155/61984712',
      jobType: 'TRAINEE',
      title: 'Management Trainee (UFLP) - Commercial & Supply Analytics',
      company: 'Unilever Bangladesh Limited',
      organizationType: 'MNC / FMCG',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'Unilever House, Gulshan North Avenue, Dhaka',
      remoteType: 'Hybrid',
      employmentType: 'Trainee',
      description:
        'The Unilever Future Leaders Programme (UFLP) is a world-renowned leadership incubator designed to develop future C-suite executives in 24 months. You will lead high-impact marketing analytics, trade distribution modeling, and sustainability initiatives.',
      responsibilities: JSON.stringify([
        'Lead sales telemetry and market share analytics across retail trade clusters',
        'Coordinate national product launch campaigns and consumer insights tracking',
        'Optimize distribution networks using Excel and data modeling techniques',
      ]),
      requirements: JSON.stringify([
        'BBA or MBA graduate (Major in MIS, Marketing, Finance, Supply Chain) or Engineering/CSE',
        'Graduated within the last 12 months or in final year',
        '0-1 year experience',
      ]),
      educationRequirements: 'BBA / MBA / Honors graduate within 1 year',
      experienceRequirements: '0-1 year (Fresh graduates & Entry level)',
      requiredSkills: JSON.stringify(['Business Analytics', 'Data Analysis', 'Project Management', 'Microsoft Excel (Advanced)']),
      preferredSkills: JSON.stringify(['Power BI', 'Consumer Insights', 'Supply Chain Analytics']),
      salary: '90,000 - 115,000 BDT/month',
      minSalary: 90000,
      maxSalary: 115000,
      currency: 'BDT',
      applicationDeadline: d4,
      applicationStartDate: now,
      applicationMethod: 'COMPANY_PORTAL',
      applicationUrl: 'https://careers.unilever.com/job/dhaka/management-trainee-uflp/34155/61984712',
      recruiterEmail: 'careers.bangladesh@unilever.com',
      status: 'ACTIVE',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job8.id,
      overallScore: 89,
      educationScore: 95,
      experienceScore: 92,
      skillsScore: 88,
      roleScore: 90,
      locationScore: 90,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: Recent BBA graduate with strong analytical foundations and startup marketing experience.',
      matchReasons: JSON.stringify([
        'Direct alignment between your digital marketing and analytics background and consumer goods.',
        'Industry-leading salary and fast-track global corporate career path.',
      ]),
      gaps: JSON.stringify(['Requires rigorous preparation for case study interview rounds.']),
      urgencyLevel: 'NORMAL',
    },
  });

  // Job 9: Brain Station 23 - Associate Product & Business Analyst
  const job9 = await prisma.job.create({
    data: {
      source: 'LinkedIn',
      sourceUrl: 'https://www.linkedin.com/jobs/view/4021892110',
      jobType: 'PRIVATE',
      title: 'Associate Product & Business Analyst (Enterprise & FinTech)',
      company: 'Brain Station 23',
      organizationType: 'Software & IT Services',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'Mohakhali DOHS, Dhaka',
      remoteType: 'Hybrid',
      employmentType: 'Full-time',
      description:
        'Brain Station 23 is seeking an Associate Product & Business Analyst to join our FinTech and Cloud solutions team. You will gather software specifications from enterprise banks, write detailed user stories in Jira, and conduct data-driven feature adoption analytics.',
      responsibilities: JSON.stringify([
        'Bridge requirements between banking clients and software engineering teams',
        'Draft Business Requirement Documents (BRD), wireframes, and process diagrams',
        'Analyze user telemetry and transaction funnels using Excel and SQL',
      ]),
      requirements: JSON.stringify([
        'Bachelor in Business Administration (BBA in MIS / Finance) or BSc in CSE / Software Engineering',
        '0 to 1 year of experience (including internships or capstone projects)',
        'Strong analytical thinking, documentation skills, and proficiency in Excel and basic SQL',
      ]),
      educationRequirements: 'BBA (MIS / Finance) or Computer Science (CSE / IT)',
      experienceRequirements: '0-1 year',
      requiredSkills: JSON.stringify(['Business Analysis', 'Requirements Gathering', 'Microsoft Excel (Advanced)', 'Agile']),
      preferredSkills: JSON.stringify(['SQL', 'Figma', 'Jira', 'Power BI']),
      salary: '45,000 - 60,000 BDT/month',
      minSalary: 45000,
      maxSalary: 60000,
      currency: 'BDT',
      applicationDeadline: d2,
      applicationStartDate: now,
      applicationMethod: 'LINKEDIN',
      applicationUrl: 'https://www.linkedin.com/jobs/view/4021892110',
      recruiterEmail: 'hr@brainstation-23.com',
      status: 'ACTIVE',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job9.id,
      overallScore: 93,
      educationScore: 98,
      experienceScore: 94,
      skillsScore: 92,
      roleScore: 95,
      locationScore: 95,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: Your BBA in MIS directly aligns with this hybrid business-tech role, and your 1-year startup experience meets all criteria.',
      matchReasons: JSON.stringify([
        'BBA in MIS is explicitly listed as a primary qualifying degree.',
        'High skills match: Business analysis, Excel, and stakeholder coordination.',
        'Rapidly expanding enterprise tech company with international client projects.',
      ]),
      gaps: JSON.stringify(['Familiarity with Jira sprint workflows is advantageous.']),
      urgencyLevel: 'HIGH',
    },
  });

  // Job 10: Therap (BD) Ltd - Junior Business & Systems Analyst
  const job10 = await prisma.job.create({
    data: {
      source: 'Bdjobs',
      sourceUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1189330',
      jobType: 'PRIVATE',
      title: 'Junior Business & Systems Analyst (US Healthcare Platform)',
      company: 'Therap (BD) Ltd',
      organizationType: 'Software & IT Services',
      country: 'Bangladesh',
      city: 'Dhaka',
      location: 'Banani, Dhaka',
      remoteType: 'On-site',
      employmentType: 'Full-time',
      description:
        'Therap Services is the US leader in developmental disability electronic documentation software. We are looking for a detail-oriented Junior Business & Systems Analyst in Dhaka to analyze clinical workflows, review electronic health records (EHR) schemas, and support global customer release cycles.',
      responsibilities: JSON.stringify([
        'Deconstruct complex healthcare service rules into software functional requirements',
        'Verify database queries and data validation rules in user acceptance test cycles',
        'Write user documentation and train support teams on new module capabilities',
      ]),
      requirements: JSON.stringify([
        'Bachelor degree in BBA (MIS), CSE, IT, or Health Informatics from a recognized university',
        '0 to 1 year experience (Fresh graduates with high aptitude are encouraged to apply)',
        'Demonstrated competence in Microsoft Excel, technical documentation, and relational concepts',
      ]),
      educationRequirements: 'BBA (MIS) / CSE / IT or Quantitative graduation',
      experienceRequirements: '0-1 year (Freshers with strong analytical skill encouraged)',
      requiredSkills: JSON.stringify(['Business Analysis', 'Documentation', 'Software Testing (UAT)', 'SQL']),
      preferredSkills: JSON.stringify(['Healthcare Workflows', 'Database Design', 'Microsoft Excel (Advanced)']),
      salary: '50,000 - 65,000 BDT/month',
      minSalary: 50000,
      maxSalary: 65000,
      currency: 'BDT',
      applicationDeadline: d3,
      applicationStartDate: now,
      applicationMethod: 'BDJOBS',
      applicationUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1189330',
      recruiterEmail: 'jobs@therapservices.net',
      status: 'ACTIVE',
    },
  });

  await prisma.jobMatch.create({
    data: {
      profileId: profile.id,
      jobId: job10.id,
      overallScore: 91,
      educationScore: 96,
      experienceScore: 92,
      skillsScore: 90,
      roleScore: 93,
      locationScore: 95,
      eligibilityStatus: 'ELIGIBLE',
      eligibilityExplanation:
        'Eligible: Your BBA in MIS background from EWU matches the required software & business analysis profile.',
      matchReasons: JSON.stringify([
        'BBA in MIS is an exact fit for systems analyst and clinical data tracking.',
        'High technical skill match: documentation, testing, and relational database understanding.',
        'Global product company with top-tier workplace culture in Banani.',
      ]),
      gaps: JSON.stringify(['US healthcare compliance familiarity will be trained on the job.']),
      urgencyLevel: 'MEDIUM',
    },
  });

  // 11. Initial Application records to show Application Tracker
  // Application 1: bKash (CV_GENERATED)
  const app1 = await prisma.application.create({
    data: {
      profileId: profile.id,
      jobId: job1.id,
      status: 'CV_GENERATED',
      applicationMethod: 'EMAIL',
      notes: 'Tailored CV generated with focus on SQL and MFS transaction analysis. Ready for email review.',
    },
  });

  await prisma.applicationEvent.createMany({
    data: [
      {
        applicationId: app1.id,
        eventType: 'DISCOVERED',
        title: 'Job Discovered',
        description: 'Position identified on Bdjobs and normalized into system.',
        timestamp: new Date(now.getTime() - 2 * 24 * 3600 * 1000),
      },
      {
        applicationId: app1.id,
        eventType: 'MATCH_CALCULATED',
        title: 'Match Assessment: 94%',
        description: 'AI analyzed candidate profile against FinTech requirements. High score achieved.',
        timestamp: new Date(now.getTime() - 1.5 * 24 * 3600 * 1000),
      },
      {
        applicationId: app1.id,
        eventType: 'CV_TAILORED',
        title: 'Truth-Preserving CV Tailored',
        description: 'Summary and skills reorganized. No unverified facts were added.',
        timestamp: new Date(now.getTime() - 1 * 24 * 3600 * 1000),
      },
    ],
  });

  // Application 2: Pathao (READY_TO_APPLY)
  const app2 = await prisma.application.create({
    data: {
      profileId: profile.id,
      jobId: job3.id,
      status: 'READY_TO_APPLY',
      applicationMethod: 'EMAIL',
      notes: 'Urgent deadline! Tailored cover letter and email draft prepared.',
    },
  });

  await prisma.applicationEvent.createMany({
    data: [
      {
        applicationId: app2.id,
        eventType: 'DISCOVERED',
        title: 'Urgent Opportunity Discovered',
        description: 'Deadline is within 24 hours. Marked as urgent priority.',
        timestamp: new Date(now.getTime() - 20 * 3600 * 1000),
      },
      {
        applicationId: app2.id,
        eventType: 'EMAIL_PREPARED',
        title: 'Email Application Drafted',
        description: 'Email addressed to talent@pathao.com prepared for user review.',
        timestamp: new Date(now.getTime() - 4 * 3600 * 1000),
      },
    ],
  });

  // Application 3: Bangladesh Bank (SHORTLISTED)
  const app3 = await prisma.application.create({
    data: {
      profileId: profile.id,
      jobId: job2.id,
      status: 'SHORTLISTED',
      applicationMethod: 'GOVERNMENT_PORTAL',
      notes: 'Eligible for 100 vacancies. Need to complete online registration on bb.org.bd.',
    },
  });

  await prisma.applicationEvent.createMany({
    data: [
      {
        applicationId: app3.id,
        eventType: 'CIRCULAR_VERIFIED',
        title: 'Government Circular Verified',
        description: 'BBA degree accepted. Candidate age 23 is within 30-year limit.',
        timestamp: new Date(now.getTime() - 3 * 24 * 3600 * 1000),
      },
    ],
  });

  // 12. Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: 'DEADLINE_URGENT',
        title: 'Urgent Deadline: Pathao (Data & BI Analyst)',
        message: 'Application deadline expires in less than 24 hours! Email draft is ready for review.',
        link: `/jobs/${job3.id}`,
        isRead: false,
      },
      {
        userId: user.id,
        type: 'HIGH_MATCH',
        title: '94% Match: bKash Junior Business Analyst',
        message: 'Your BBA in MIS and Power BI experience is a strong match for this FinTech opening.',
        link: `/jobs/${job1.id}`,
        isRead: false,
      },
      {
        userId: user.id,
        type: 'GOVT_CIRCULAR',
        title: 'Official Circular: Bangladesh Bank Assistant Director',
        message: '100 vacancies for Grade 9 AD (General). You meet all educational and age criteria.',
        link: `/jobs/${job2.id}`,
        isRead: false,
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
