export type ProvenanceType = 'EXTRACTED' | 'ENTERED' | 'INFERRED' | 'CONFIRMED';

export type JobType = 'PRIVATE' | 'GOVERNMENT' | 'INTERNSHIP' | 'TRAINEE' | 'CONTRACT';

export type ApplicationMethod = 'EMAIL' | 'LINKEDIN' | 'BDJOBS' | 'COMPANY_PORTAL' | 'GOVERNMENT_PORTAL';

export type EligibilityStatus = 'ELIGIBLE' | 'LIKELY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'NEEDS_VERIFICATION';

export type UrgencyLevel = 'URGENT' | 'HIGH' | 'MEDIUM' | 'NORMAL' | 'EXPIRED';

export type ApplicationStatus =
  | 'SAVED'
  | 'SHORTLISTED'
  | 'CV_GENERATED'
  | 'READY_TO_APPLY'
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'OFFER'
  | 'WITHDRAWN';

export interface EducationItem {
  id?: string;
  degree: string;
  major?: string;
  institution: string;
  graduationYear?: number;
  cgpa?: string;
  provenance: ProvenanceType;
}

export interface ExperienceItem {
  id?: string;
  jobTitle: string;
  company: string;
  location?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  provenance: ProvenanceType;
}

export interface SkillItem {
  id?: string;
  name: string;
  category: 'TECHNICAL' | 'SOFTWARE' | 'BUSINESS' | 'SOFT';
  provenance: ProvenanceType;
  confidence?: number;
}

export interface ProjectItem {
  id?: string;
  name: string;
  description: string;
  tools: string[];
  outcome?: string;
  repoUrl?: string;
  liveUrl?: string;
}

export interface CareerPreferences {
  targetTitles: string[];
  targetIndustries: string[];
  experienceLevel: string;
  jobTypes: string[];
  locations: string[];
  remotePreference: string;
  minSalary?: number;
  currency: string;
  salaryNegotiable: boolean;
  preferredOrgTypes: string[];
  naturalLanguageGoal?: string;
}

export interface CertificationItem {
  id?: string;
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface CandidateProfile {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  address?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  bio?: string;
  yearsOfExperience: number;
  currentStatus?: string;
  completionPercentage: number;
  missingFields: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  certifications?: CertificationItem[];
  projects: ProjectItem[];
  careerPreferences?: CareerPreferences;
}

export interface NormalizedJob {
  id: string;
  source: string;
  sourceUrl?: string;
  jobType: JobType;
  title: string;
  company: string;
  organizationType?: string;
  country: string;
  city?: string;
  location: string;
  remoteType: 'On-site' | 'Hybrid' | 'Remote';
  employmentType: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferredRequirements: string[];
  educationRequirements: string;
  experienceRequirements: string;
  requiredSkills: string[];
  preferredSkills: string[];
  salary?: string;
  minSalary?: number;
  maxSalary?: number;
  currency: string;
  applicationDeadline: string; // ISO string
  applicationStartDate?: string;
  applicationMethod: ApplicationMethod;
  applicationUrl?: string;
  recruiterEmail?: string;
  postedDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
  governmentCircular?: GovernmentCircularDetails;
}

export interface GovernmentCircularDetails {
  id?: string;
  recruitingOrganization: string;
  ministry: string;
  postTitle: string;
  vacancies: number;
  educationalQualification: string;
  acceptedDegrees: string[];
  requiredExperience: string;
  ageLimit: string;
  maxAge: number;
  quotaAgeLimit?: number;
  quotaInformation?: string;
  districtEligibility?: string;
  applicationFee: string;
  paymentMethod: string;
  circularNumber?: string;
  circularPdfUrl?: string;
  applicationWebsite: string;
  preliminaryExam?: string;
  writtenExam?: string;
  vivaExam?: string;
}

export interface MatchAssessment {
  overallScore: number;
  educationScore: number;
  experienceScore: number;
  skillsScore: number;
  roleScore: number;
  locationScore: number;
  eligibilityStatus: EligibilityStatus;
  eligibilityExplanation: string;
  matchReasons: string[];
  gaps: string[];
  urgencyLevel: UrgencyLevel;
}

export interface TailoredCVDirection {
  originalSummary: string;
  tailoredSummary: string;
  orderedSkills: { name: string; relevance: 'HIGH' | 'MEDIUM' | 'STANDARD' }[];
  highlightedExperiences: {
    company: string;
    jobTitle: string;
    originalAchievements: string[];
    tailoredAchievements: string[];
  }[];
  highlightedProjects: {
    name: string;
    originalDescription: string;
    tailoredDescription: string;
  }[];
  changesSummary: string[];
}
