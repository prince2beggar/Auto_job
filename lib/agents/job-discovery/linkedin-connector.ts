import { NormalizedJob } from '../../types';
import { JobConnector } from './types';

export class LinkedInConnector implements JobConnector {
  sourceId = 'linkedin';
  sourceName = 'LinkedIn';
  country = 'Bangladesh';

  async fetchJobs(): Promise<NormalizedJob[]> {
    const now = new Date();
    const d1 = new Date(now.getTime() + 3 * 24 * 3600 * 1000); // 3 days (HIGH)
    const d2 = new Date(now.getTime() + 8 * 24 * 3600 * 1000); // 8 days (NORMAL)
    const d3 = new Date(now.getTime() + 14 * 24 * 3600 * 1000); // 14 days (NORMAL)

    const jobs: NormalizedJob[] = [
      {
        id: 'linkedin-001',
        source: 'LinkedIn',
        sourceUrl: 'https://www.linkedin.com/jobs/view/4021892110',
        jobType: 'PRIVATE',
        title: 'Associate Product Analyst',
        company: 'Brain Station 23',
        organizationType: 'Private / Enterprise Tech',
        country: 'Bangladesh',
        city: 'Dhaka',
        location: 'Mohakhali DOHS, Dhaka',
        remoteType: 'Hybrid',
        employmentType: 'Full-time',
        description:
          'Brain Station 23 is seeking an Associate Product Analyst to assist in agile software product deliveries for global fintech and healthcare clients. You will bridge business requirements, write user stories, and track product adoption KPIs.',
        responsibilities: [
          'Deconstruct client workflows into structured functional specifications and Jira tickets',
          'Coordinate sprint plannings and sprint review sessions with development squads',
          'Analyze user event telemetry and retention trends using Excel and SQL',
          'Create high-level process flowcharts and wireframe documentation'
        ],
        requirements: [
          'Bachelor in Business Administration (BBA in MIS/Finance) or BSc in CSE / SWE',
          '0 to 1 year of experience (including internships or academic capstones)',
          'Strong analytical acumen, requirements gathering, and professional communication',
          'Familiarity with Excel, Power BI or basic SQL'
        ],
        preferredRequirements: ['Scrum framework knowledge', 'Experience with Figma or Miro'],
        educationRequirements: 'BBA (MIS / Marketing) or Computer Science degree',
        experienceRequirements: '0-1 year',
        requiredSkills: ['Business Analysis', 'Requirements Gathering', 'Microsoft Excel (Advanced)', 'Stakeholder Communication'],
        preferredSkills: ['Agile', 'SQL', 'Figma'],
        salary: '45,000 - 60,000 BDT/month',
        minSalary: 45000,
        maxSalary: 60000,
        currency: 'BDT',
        applicationDeadline: d1.toISOString(),
        applicationStartDate: now.toISOString(),
        applicationMethod: 'LINKEDIN',
        applicationUrl: 'https://www.linkedin.com/jobs/view/4021892110',
        postedDate: new Date(now.getTime() - 1 * 24 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
      },
      {
        id: 'linkedin-002',
        source: 'LinkedIn',
        sourceUrl: 'https://www.linkedin.com/jobs/view/4023910022',
        jobType: 'PRIVATE',
        title: 'Junior Marketing & Growth Analyst',
        company: 'Unilever Bangladesh',
        organizationType: 'MNC / FMCG',
        country: 'Bangladesh',
        city: 'Dhaka',
        location: 'Gulshan, Dhaka',
        remoteType: 'On-site',
        employmentType: 'Full-time',
        description:
          'Unilever Bangladesh is looking for a data-savvy Junior Marketing & Growth Analyst to support category growth across digital and traditional retail distribution channels.',
        responsibilities: [
          'Evaluate campaign ROI and sales volume data across brand portfolios',
          'Build brand tracker dashboards in Power BI and Excel',
          'Conduct competitor price-point benchmarking and market share analysis',
          'Present synthesized consumer sentiment trends to brand directors'
        ],
        requirements: [
          'BBA graduate with concentration in Marketing, Finance, or MIS',
          'Proficiency in Excel (data modeling, nested lookups) and Power BI',
          'High analytical curiosity and strong presentation skills',
          'Fresh graduates or candidates with up to 1 year experience'
        ],
        preferredRequirements: ['Experience with digital marketing analytics (Google Analytics/Meta Ads)'],
        educationRequirements: 'BBA with Marketing or MIS focus',
        experienceRequirements: '0-1 year',
        requiredSkills: ['Market Research', 'Microsoft Excel (Advanced)', 'Power BI', 'Business Analysis'],
        preferredSkills: ['Digital Marketing', 'Data Visualization'],
        salary: '60,000 - 75,000 BDT/month',
        minSalary: 60000,
        maxSalary: 75000,
        currency: 'BDT',
        applicationDeadline: d2.toISOString(),
        applicationStartDate: now.toISOString(),
        applicationMethod: 'COMPANY_PORTAL',
        applicationUrl: 'https://careers.unilever.com/bangladesh/marketing-analyst',
        recruiterEmail: 'bangladesh.careers@unilever.com',
        postedDate: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
      }
    ];

    return jobs;
  }
}
