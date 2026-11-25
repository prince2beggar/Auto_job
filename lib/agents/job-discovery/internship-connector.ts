import { NormalizedJob } from '../../types';
import { JobConnector } from './types';

export class InternshipTraineeConnector implements JobConnector {
  sourceId = 'internships';
  sourceName = 'Internship & Trainee Programs';
  country = 'Bangladesh';

  async fetchJobs(): Promise<NormalizedJob[]> {
    const now = new Date();
    const d1 = new Date(now.getTime() + 4 * 24 * 3600 * 1000); // 4 days (MEDIUM)
    const d2 = new Date(now.getTime() + 10 * 24 * 3600 * 1000); // 10 days (NORMAL)

    const jobs: NormalizedJob[] = [
      {
        id: 'intern-001',
        source: 'Corporate Careers',
        sourceUrl: 'https://www.grameenphone.com/about/careers/internship-program',
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
          'Grameenphone invites high-potential undergraduate and fresh graduate candidates for a 6-month intensive Commercial Analytics & BI Internship. You will work on massive subscriber datasets, consumer churn prediction, and digital service adoption analytics.',
        responsibilities: [
          'Assist senior data analysts in tracking daily active users and ARPU across subscriber clusters',
          'Develop visualization dashboards using Power BI and Microsoft Excel',
          'Execute exploratory SQL queries to segment customer bundles and offer conversions'
        ],
        requirements: [
          'Undergraduate student in final year or fresh graduate in BBA (MIS / Finance / Marketing) or BSc CSE',
          'Good knowledge of Excel, data visualization, and basic SQL',
          'Proactive learner with passion for telecommunications analytics'
        ],
        preferredRequirements: ['Previous coursework or project in business analytics'],
        educationRequirements: 'Current student or fresh BBA / BSc graduate',
        experienceRequirements: '0 years (Fresh graduates / final year students)',
        requiredSkills: ['Power BI', 'Microsoft Excel (Advanced)', 'Business Analysis', 'Data Visualization'],
        preferredSkills: ['SQL', 'Python'],
        salary: '25,000 BDT/month (Paid Internship + GPHouse transport & subsidized dining)',
        minSalary: 25000,
        maxSalary: 25000,
        currency: 'BDT',
        applicationDeadline: d1.toISOString(),
        applicationStartDate: now.toISOString(),
        applicationMethod: 'EMAIL',
        recruiterEmail: 'careers.internship@grameenphone.com',
        applicationUrl: 'https://www.grameenphone.com/about/careers/internship-program',
        postedDate: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
      },
      {
        id: 'trainee-001',
        source: 'Corporate Careers',
        sourceUrl: 'https://careers.bat.com/job/global-graduate-operations-dhaka',
        jobType: 'TRAINEE',
        title: 'Global Graduate Trainee - Business & Supply Chain Analytics',
        company: 'British American Tobacco (BAT Bangladesh)',
        organizationType: 'MNC / FMCG',
        country: 'Bangladesh',
        city: 'Dhaka',
        location: 'Mohakhali, Dhaka',
        remoteType: 'On-site',
        employmentType: 'Trainee',
        description:
          'The BAT Global Graduate Programme is an accelerated 18-month management trainee track designed to develop future business leaders. You will rotate across commercial analytics, operations planning, and strategic trade marketing.',
        responsibilities: [
          'Lead analytical projects optimizing supply distribution metrics and inventory logistics',
          'Build end-to-end data pipelines and visualization models for senior leadership reviews',
          'Drive cross-departmental business process improvements'
        ],
        requirements: [
          'Graduating or graduated within the last 1 year with a Bachelor or Master in Business Administration (BBA) or Engineering',
          'CGPA 3.30 or above',
          '0 to 1 year of total work or internship experience',
          'Outstanding leadership demonstrated in co-curriculars or internships'
        ],
        preferredRequirements: ['Strong problem-solving and presentation aptitude'],
        educationRequirements: 'BBA or Engineering graduate (CGPA >= 3.30)',
        experienceRequirements: '0-1 year',
        requiredSkills: ['Business Analysis', 'Critical Thinking', 'Stakeholder Communication', 'Microsoft Excel (Advanced)'],
        preferredSkills: ['Power BI', 'Project Management'],
        salary: '85,000 - 110,000 BDT/month (Management Trainee scale + executive benefits)',
        minSalary: 85000,
        maxSalary: 110000,
        currency: 'BDT',
        applicationDeadline: d2.toISOString(),
        applicationStartDate: now.toISOString(),
        applicationMethod: 'COMPANY_PORTAL',
        applicationUrl: 'https://careers.bat.com/job/global-graduate-operations-dhaka',
        recruiterEmail: 'bat_bangladesh_recruitment@bat.com',
        postedDate: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
        status: 'ACTIVE',
      }
    ];

    return jobs;
  }
}
