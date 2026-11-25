import { CandidateProfile, CareerPreferences } from '../types';
import { generateJSON } from '../ai/gemini';

export class ProfileAgent {
  /**
   * Calculates completion score (0-100%) and identifies missing critical fields.
   */
  static calculateCompletion(profile: Partial<CandidateProfile>): {
    score: number;
    missingFields: string[];
  } {
    let score = 0;
    const missing: string[] = [];

    // Personal info (20%)
    if (profile.fullName && profile.fullName.trim().length > 0) score += 10;
    else missing.push('Full Name');

    if (profile.email && profile.email.includes('@')) score += 5;
    else missing.push('Email Address');

    if (profile.phone && profile.phone.trim().length > 0) score += 5;
    else missing.push('Phone Number');

    // Location (10%)
    if (profile.city || profile.country) score += 10;
    else missing.push('Current Location / City');

    // Education (20%)
    if (profile.education && profile.education.length > 0) {
      score += 20;
    } else {
      missing.push('Education details (Degree & University)');
    }

    // Experience or Projects (20%)
    if (
      (profile.experience && profile.experience.length > 0) ||
      (profile.projects && profile.projects.length > 0)
    ) {
      score += 20;
    } else {
      missing.push('Experience or Academic / Personal Projects');
    }

    // Skills (15%)
    if (profile.skills && profile.skills.length >= 3) {
      score += 15;
    } else {
      missing.push('At least 3 Core Skills');
    }

    // Career Preferences (15%)
    if (
      profile.careerPreferences &&
      profile.careerPreferences.targetTitles &&
      profile.careerPreferences.targetTitles.length > 0
    ) {
      score += 10;
    } else {
      missing.push('Target Job Titles / Roles');
    }

    if (profile.careerPreferences?.minSalary) {
      score += 5;
    } else {
      missing.push('Minimum Desired Salary Preference');
    }

    return {
      score: Math.min(score, 100),
      missingFields: missing,
    };
  }

  /**
   * Parses natural language career preferences into structured object.
   * e.g.: "I am looking for Business Analyst, Data Analyst or BI jobs in Dhaka or remote. Entry level, minimum 30k BDT"
   */
  static async parseNaturalLanguageGoal(goalText: string): Promise<CareerPreferences> {
    const systemPrompt = `You are a career profile structuring agent. Given a user's natural language career request, extract structured preferences into JSON.
JSON format:
{
  "targetTitles": string[],
  "targetIndustries": string[],
  "experienceLevel": string,
  "jobTypes": string[],
  "locations": string[],
  "remotePreference": "On-site" | "Hybrid" | "Remote" | "Flexible",
  "minSalary": number,
  "currency": string,
  "salaryNegotiable": boolean,
  "preferredOrgTypes": string[]
}`;

    const fallback = (): CareerPreferences => {
      const lower = goalText.toLowerCase();
      const targetTitles: string[] = [];
      if (lower.includes('business analyst') || lower.includes('ba')) targetTitles.push('Business Analyst');
      if (lower.includes('data analyst')) targetTitles.push('Data Analyst');
      if (lower.includes('business intelligence') || lower.includes('bi')) targetTitles.push('Business Intelligence Analyst');
      if (lower.includes('product') || lower.includes('pm')) targetTitles.push('Associate Product Manager');
      if (lower.includes('marketing')) targetTitles.push('Digital Marketing Executive');
      if (targetTitles.length === 0) targetTitles.push('Business Analyst', 'Data Analyst');

      const locations: string[] = [];
      if (lower.includes('dhaka')) locations.push('Dhaka');
      if (lower.includes('remote')) locations.push('Remote');
      if (locations.length === 0) locations.push('Dhaka', 'Remote');

      const jobTypes: string[] = [];
      if (lower.includes('full-time') || lower.includes('full time')) jobTypes.push('Full-time');
      if (lower.includes('intern') || lower.includes('internship')) jobTypes.push('Internship');
      if (lower.includes('trainee') || lower.includes('graduate')) jobTypes.push('Trainee');
      if (jobTypes.length === 0) jobTypes.push('Full-time', 'Internship');

      let minSalary = 30000;
      const salaryMatch = lower.match(/(\d+[\d,]*)\s*(k|bdt|tk|taka)?/);
      if (salaryMatch) {
        let val = parseInt(salaryMatch[1].replace(/,/g, ''), 10);
        if (salaryMatch[2] === 'k' || val < 100) val = val * 1000;
        if (val >= 10000 && val <= 500000) minSalary = val;
      }

      return {
        targetTitles,
        targetIndustries: ['Technology', 'Financial Services', 'Telecommunications', 'FMCG'],
        experienceLevel: lower.includes('entry') || lower.includes('fresh') ? 'Entry Level (0-1 yrs)' : 'Junior',
        jobTypes,
        locations,
        remotePreference: lower.includes('remote') ? 'Flexible' : 'On-site',
        minSalary,
        currency: 'BDT',
        salaryNegotiable: true,
        preferredOrgTypes: ['Private', 'Government', 'MNC', 'Startup'],
        naturalLanguageGoal: goalText,
      };
    };

    return generateJSON<CareerPreferences>(
      systemPrompt,
      `User career request: "${goalText}"`,
      fallback
    );
  }
}
