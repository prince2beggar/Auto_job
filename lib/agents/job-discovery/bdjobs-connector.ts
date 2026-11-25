import { NormalizedJob } from '../../types';
import { JobConnector } from './types';

export class BdjobsConnector implements JobConnector {
  sourceId = 'bdjobs';
  sourceName = 'Bdjobs';
  country = 'Bangladesh';

  async fetchJobs(): Promise<NormalizedJob[]> {
    const now = new Date();
    
    // Create deadlines ranging from 1 day to 14 days
    const d1 = new Date(now.getTime() + 18 * 3600 * 1000); // 18 hours (URGENT)
    const d2 = new Date(now.getTime() + 2.5 * 24 * 3600 * 1000); // 2.5 days (HIGH)
    const d3 = new Date(now.getTime() + 6 * 24 * 3600 * 1000); // 6 days (MEDIUM)
    const d4 = new Date(now.getTime() + 12 * 24 * 3600 * 1000); // 12 days (NORMAL)

    const jobs: NormalizedJob[] = [
      {
        id: 'bdjobs-001',
        source: 'Bdjobs',
        sourceUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1184920',
        jobType: 'PRIVATE',
        title: 'Junior Business Analyst (FinTech)',
        company: 'bKash Limited',
        organizationType: 'Private / MFS',
        country: 'Bangladesh',
        city: 'Dhaka',
        location: 'Dhaka (Shadhinata Tower, Jahangir Gate)',
        remoteType: 'Hybrid',
        employmentType: 'Full-time',
        description:
          'bKash is seeking an analytical Junior Business Analyst to join our Product & Commercial Analytics unit. You will collaborate with cross-functional teams to translate customer transactional patterns into actionable operational insights.',
        responsibilities: [
          'Gather and document detailed business and technical requirements from product owners',
          'Create and maintain automated Power BI and Excel dashboards for daily MFS metrics',
          'Conduct SQL queries against data marts to investigate user drop-offs and retention trends',
          'Participate in sprint grooming and user acceptance testing (UAT)'
        ],
        requirements: [
          'BBA in MIS, Finance, Business Analytics, or BSc in CSE / Data Science from a reputed university',
          '0 to 1 year of professional or internship experience in data analytics or business analysis',
          'Demonstrated proficiency in Microsoft Excel (Lookups, Pivot, Formulas) and Power BI',
          'Fundamental understanding of SQL query structure'
        ],
        preferredRequirements: [
          'Basic Python data manipulation (pandas)',
          'Experience with Agile / Scrum ceremonies'
        ],
        educationRequirements: 'BBA in MIS / Business Analytics / Finance or relevant degree',
        experienceRequirements: '0-1 year (Fresh graduates with internship experience strongly encouraged)',
        requiredSkills: ['Business Analysis', 'Power BI', 'Microsoft Excel (Advanced)', 'SQL'],
        preferredSkills: ['Python', 'UAT Testing', 'Agile'],
        salary: '45,000 - 55,000 BDT/month',
        minSalary: 45000,
        maxSalary: 55000,
        currency: 'BDT',
        applicationDeadline: d2.toISOString(),
        applicationStartDate: now.toISOString(),
        applicationMethod: 'EMAIL',
        recruiterEmail: 'careers.analytics@bkash.com',
        applicationUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1184920',
        postedDate: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
      },
      {
        id: 'bdjobs-002',
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
        responsibilities: [
          'Build daily operational tracking reports for fleet and merchant performance',
          'Cleanse and structure raw operational logs using SQL and Excel',
          'Visualize core business metrics in Power BI and Google Data Studio',
          'Coordinate with city operations managers to identify delivery bottlenecks'
        ],
        requirements: [
          'Bachelor degree in Business Administration, Statistics, Economics, or CSE',
          'Strong command of Power BI, Excel, and SQL',
          'Analytical mindset with sharp attention to detail',
          '0-1 year relevant experience'
        ],
        preferredRequirements: ['Experience with ride-hailing or delivery logistics metrics'],
        educationRequirements: 'BBA / BSc in quantitative field',
        experienceRequirements: '0-1 year experience',
        requiredSkills: ['Power BI', 'SQL', 'Microsoft Excel (Advanced)', 'Data Visualization'],
        preferredSkills: ['Google Data Studio', 'Problem Solving'],
        salary: '40,000 - 50,000 BDT/month',
        minSalary: 40000,
        maxSalary: 50000,
        currency: 'BDT',
        applicationDeadline: d1.toISOString(), // URGENT (<24h)
        applicationStartDate: now.toISOString(),
        applicationMethod: 'EMAIL',
        recruiterEmail: 'talent@pathao.com',
        applicationUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1185301',
        postedDate: new Date(now.getTime() - 4 * 24 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
      },
      {
        id: 'bdjobs-003',
        source: 'Bdjobs',
        sourceUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1186712',
        jobType: 'PRIVATE',
        title: 'Associate Business Intelligence Executive',
        company: 'Chaldal Limited',
        organizationType: 'Private / E-Commerce',
        country: 'Bangladesh',
        city: 'Dhaka',
        location: 'Dhanmondi, Dhaka',
        remoteType: 'On-site',
        employmentType: 'Full-time',
        description:
          'Chaldal is hiring an Associate BI Executive to turn grocery purchase patterns and inventory turnover rates into actionable forecasting dashboards.',
        responsibilities: [
          'Monitor inventory replenishment velocity and warehouse fulfillment metrics',
          'Build custom views and dashboards in Power BI and Metabase',
          'Collaborate with supply chain category leads'
        ],
        requirements: [
          'BBA / Bachelor in Business, Supply Chain, or Computer Science',
          'Solid grip on Excel formulas and data visualization in Power BI or Tableau',
          'Fresh graduates with passion for consumer analytics are encouraged to apply'
        ],
        preferredRequirements: ['Familiarity with relational databases and basic SQL'],
        educationRequirements: 'BBA or equivalent degree',
        experienceRequirements: '0-1 year',
        requiredSkills: ['Microsoft Excel (Advanced)', 'Power BI', 'Business Analysis'],
        preferredSkills: ['SQL', 'Supply Chain Analytics'],
        salary: '35,000 - 45,000 BDT/month',
        minSalary: 35000,
        maxSalary: 45000,
        currency: 'BDT',
        applicationDeadline: d3.toISOString(),
        applicationStartDate: now.toISOString(),
        applicationMethod: 'BDJOBS',
        applicationUrl: 'https://jobs.bdjobs.com/jobdetails.asp?id=1186712',
        postedDate: now.toISOString(),
        status: 'ACTIVE',
      }
    ];

    return jobs;
  }
}
