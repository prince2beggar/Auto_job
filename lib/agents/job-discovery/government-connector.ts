import { NormalizedJob } from '../../types';
import { JobConnector } from './types';

export class GovernmentCircularConnector implements JobConnector {
  sourceId = 'govt_circular';
  sourceName = 'Official Government Circulars';
  country = 'Bangladesh';

  async fetchJobs(): Promise<NormalizedJob[]> {
    const now = new Date();
    const d1 = new Date(now.getTime() + 1.5 * 24 * 3600 * 1000); // 1.5 days (HIGH/URGENT)
    const d2 = new Date(now.getTime() + 7 * 24 * 3600 * 1000); // 7 days (MEDIUM)
    const d3 = new Date(now.getTime() + 15 * 24 * 3600 * 1000); // 15 days (NORMAL)

    const jobs: NormalizedJob[] = [
      {
        id: 'govt-001',
        source: 'Official Circular (Bangladesh Bank)',
        sourceUrl: 'https://erecruitment.bb.org.bd/onlineapp/jobdetails.php?id=1024',
        jobType: 'GOVERNMENT',
        title: 'Assistant Director (General)',
        company: 'Bangladesh Bank (Central Bank)',
        organizationType: 'Government / Central Bank',
        country: 'Bangladesh',
        city: 'Dhaka',
        location: 'Motijheel, Dhaka',
        remoteType: 'On-site',
        employmentType: 'Full-time',
        description:
          'Bangladesh Bank invites online applications from eligible Bangladeshi citizens for the post of Assistant Director (General). Recruited officers will engage in monetary policy implementation, banking regulation, foreign exchange reserve supervision, and economic data research.',
        responsibilities: [
          'Audit and inspect scheduled commercial bank financial compliance reports',
          'Analyze financial statement data and macroeconomic indicators',
          'Prepare policy briefs and statistical summaries for governor memos',
          'Execute digital regulatory directives'
        ],
        requirements: [
          'Four-year Bachelor or Master degree from any recognized university in Business Administration (BBA), Economics, Finance, Banking, Statistics, or related field',
          'At least two first divisions/classes or equivalent CGPA in academic results',
          'No 3rd division/class in any examination',
          'Age strictly between 21 and 30 years as on circular date (32 years for freedom fighter quota)'
        ],
        preferredRequirements: ['Strong analytical thinking and written English communication'],
        educationRequirements: '4-year BBA / Honors in Economics, Finance, Statistics, or Management',
        experienceRequirements: 'No prior work experience required (Entry-level Cadre equivalent)',
        requiredSkills: ['Business Analysis', 'Microsoft Excel (Advanced)', 'Data Visualization', 'Critical Thinking'],
        preferredSkills: ['Economics Analysis', 'Statistical Modeling'],
        salary: 'Grade 9: 22,000 - 53,060 BDT (National Pay Scale 2015 + Govt Allowances ~ 45,000 BDT gross)',
        minSalary: 42000,
        maxSalary: 55000,
        currency: 'BDT',
        applicationDeadline: d2.toISOString(),
        applicationStartDate: now.toISOString(),
        applicationMethod: 'GOVERNMENT_PORTAL',
        applicationUrl: 'https://erecruitment.bb.org.bd/onlineapp/jobdetails.php?id=1024',
        postedDate: new Date(now.getTime() - 5 * 24 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
        governmentCircular: {
          recruitingOrganization: 'Bangladesh Bank',
          ministry: 'Bank and Financial Institutions Division, Ministry of Finance',
          postTitle: 'Assistant Director (General)',
          vacancies: 100,
          educationalQualification: '4-year Bachelor degree in BBA / Economics / Finance / Statistics',
          acceptedDegrees: ['BBA', 'Bachelor of Business Administration', 'Economics', 'Finance', 'Statistics', 'CSE'],
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
          vivaExam: 'Viva Voce (25 marks)'
        }
      },
      {
        id: 'govt-002',
        source: 'Official Circular (ICT Division)',
        sourceUrl: 'https://bcc.teletalk.com.bd',
        jobType: 'GOVERNMENT',
        title: 'Assistant Programmer / Systems Analyst',
        company: 'Bangladesh Computer Council (BCC), ICT Division',
        organizationType: 'Government / Ministry of ICT',
        country: 'Bangladesh',
        city: 'Dhaka',
        location: 'Agargaon, Dhaka',
        remoteType: 'On-site',
        employmentType: 'Full-time',
        description:
          'Bangladesh Computer Council invites applications for Assistant Programmer / IT Business Analyst under the Ministry of Posts, Telecommunications and Information Technology.',
        responsibilities: [
          'Support government e-service requirements analysis and database documentation',
          'Assist in interoperability standards evaluation for national digital portals',
          'Conduct quality assurance testing and data analytics on citizen services'
        ],
        requirements: [
          'Bachelor degree in Computer Science, ICT, MIS, Business Information Technology, or relevant quantitative science',
          'Age: 18-30 years (32 years for quota candidates)',
          'Demonstrated knowledge of databases (SQL) and basic programming/data tools'
        ],
        preferredRequirements: ['Experience in software requirements specification (SRS)'],
        educationRequirements: 'BSc in CSE/ICT or BBA in MIS/Computer Information Systems',
        experienceRequirements: 'Fresh graduates eligible',
        requiredSkills: ['SQL', 'Power BI', 'Business Analysis', 'Requirements Gathering'],
        preferredSkills: ['Python', 'System Design'],
        salary: 'Grade 9: 22,000 - 53,060 BDT (National Pay Scale + Allowances)',
        minSalary: 40000,
        maxSalary: 52000,
        currency: 'BDT',
        applicationDeadline: d1.toISOString(), // Impending deadline!
        applicationStartDate: now.toISOString(),
        applicationMethod: 'GOVERNMENT_PORTAL',
        applicationUrl: 'https://bcc.teletalk.com.bd',
        postedDate: new Date(now.getTime() - 8 * 24 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
        governmentCircular: {
          recruitingOrganization: 'Bangladesh Computer Council (BCC)',
          ministry: 'Information and Communication Technology (ICT) Division',
          postTitle: 'Assistant Programmer / Systems Analyst',
          vacancies: 24,
          educationalQualification: 'Bachelor in CSE, MIS, ICT, or related field',
          acceptedDegrees: ['BBA in MIS', 'BSc in CSE', 'ICT', 'Software Engineering'],
          requiredExperience: 'Fresh graduates accepted',
          ageLimit: '18 to 30 years (32 for Quota)',
          maxAge: 30,
          quotaAgeLimit: 32,
          quotaInformation: 'Standard government quota rules applicable',
          districtEligibility: 'All districts eligible except specified quota restrictions',
          applicationFee: '223 BDT',
          paymentMethod: 'Teletalk Prepaid Mobile SMS',
          circularNumber: 'BCC/Admin/Rect/2026-102',
          circularPdfUrl: 'https://bcc.portal.gov.bd/sites/default/files/files/bcc.portal.gov.bd/notices/circular_2026.pdf',
          applicationWebsite: 'http://bcc.teletalk.com.bd',
          preliminaryExam: 'MCQ Test (100 Marks: Technical & General)',
          writtenExam: 'Written Subjective Examination (100 Marks)',
          vivaExam: 'Viva Voce & Practical Test (50 Marks)'
        }
      },
      {
        id: 'govt-003',
        source: 'Official Circular (BPSC)',
        sourceUrl: 'http://bpsc.teletalk.com.bd',
        jobType: 'GOVERNMENT',
        title: 'Research Officer (Planning & Economic Evaluation)',
        company: 'Planning Commission, Ministry of Planning',
        organizationType: 'Government / Commission',
        country: 'Bangladesh',
        city: 'Dhaka',
        location: 'Sher-e-Bangla Nagar, Dhaka',
        remoteType: 'On-site',
        employmentType: 'Full-time',
        description:
          'Bangladesh Public Service Commission (BPSC) announces recruitment for Research Officer in the Planning Division. Officers assist in national development project evaluation (DPP/RDPP), economic feasibility analysis, and public expenditure metrics.',
        responsibilities: [
          'Evaluate socio-economic viability of sectoral development projects',
          'Analyze multi-year budgetary expenditures and project timelines',
          'Maintain development project tracking spreadsheets and analytical databases'
        ],
        requirements: [
          '4-year Bachelor or Master degree in Economics, Business Administration (BBA), Statistics, or Public Administration',
          'Minimum 2nd Class / CGPA 2.50 or above',
          'Age strictly between 21 and 30 years'
        ],
        preferredRequirements: ['Proficiency in statistical software and Excel'],
        educationRequirements: 'BBA / Economics / Statistics degree',
        experienceRequirements: 'Fresh graduates eligible',
        requiredSkills: ['Business Analysis', 'Microsoft Excel (Advanced)', 'Market Research', 'Critical Thinking'],
        preferredSkills: ['Econometrics', 'Public Policy'],
        salary: 'Grade 9: 22,000 - 53,060 BDT + Govt Allowances',
        minSalary: 42000,
        maxSalary: 54000,
        currency: 'BDT',
        applicationDeadline: d3.toISOString(),
        applicationStartDate: now.toISOString(),
        applicationMethod: 'GOVERNMENT_PORTAL',
        applicationUrl: 'http://bpsc.teletalk.com.bd',
        postedDate: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
        governmentCircular: {
          recruitingOrganization: 'Planning Division, Ministry of Planning',
          ministry: 'Ministry of Planning',
          postTitle: 'Research Officer (Non-Cadre)',
          vacancies: 18,
          educationalQualification: '4-year Bachelor degree in BBA, Economics, or Statistics',
          acceptedDegrees: ['BBA', 'Economics', 'Statistics', 'Development Studies'],
          requiredExperience: 'No experience needed',
          ageLimit: '21 to 30 years',
          maxAge: 30,
          quotaAgeLimit: 32,
          quotaInformation: 'Standard BPSC non-cadre quota breakdown applies',
          districtEligibility: 'All administrative districts eligible',
          applicationFee: '500 BDT',
          paymentMethod: 'Teletalk SMS (BPSC-Form 5A)',
          circularNumber: 'BPSC/Non-Cadre/Rect-32/2026',
          circularPdfUrl: 'http://bpsc.gov.bd/notices/research_officer_circular.pdf',
          applicationWebsite: 'http://bpsc.teletalk.com.bd',
          preliminaryExam: 'Preliminary Screening Examination (100 marks)',
          writtenExam: 'Written Competitive Examination (200 marks)',
          vivaExam: 'Oral Interview / Viva Voce (50 marks)'
        }
      }
    ];

    return jobs;
  }
}
