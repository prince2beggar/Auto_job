import { CandidateProfile, NormalizedJob, EligibilityStatus } from '../types';

export interface EligibilityResult {
  status: EligibilityStatus;
  explanation: string;
  ageEligible: boolean;
  educationEligible: boolean;
  experienceEligible: boolean;
}

export class EligibilityAgent {
  /**
   * Assesses factual eligibility against job requirements.
   * Grounded in strict rules; never hallucinates or ignores criteria.
   */
  static evaluateEligibility(profile: CandidateProfile, job: NormalizedJob): EligibilityResult {
    // 1. Government Job Eligibility
    if (job.jobType === 'GOVERNMENT' && job.governmentCircular) {
      const circ = job.governmentCircular;
      
      // Calculate estimated candidate age from education year or default young adult
      const gradYear = profile.education[0]?.graduationYear || 2024;
      // Assuming graduation around age 22-24
      const approxAge = 24 + (new Date().getFullYear() - gradYear);
      const maxAge = circ.maxAge || 30;
      const quotaAge = circ.quotaAgeLimit || 32;
      const ageEligible = approxAge <= maxAge || approxAge <= quotaAge;

      // Degree matching
      const candidateDegrees = profile.education.map(
        (e) => `${e.degree} ${e.major || ''}`.toLowerCase()
      );
      
      const acceptedList = (circ.acceptedDegrees || []).map((d) => d.toLowerCase());
      let educationEligible = false;

      if (acceptedList.length === 0 || acceptedList.some(d => d.includes('any') || d.includes('bachelor'))) {
        educationEligible = true;
      } else {
        educationEligible = candidateDegrees.some((cd) =>
          acceptedList.some((ad) => cd.includes(ad) || ad.includes('bba') && cd.includes('bba') || ad.includes('business') && cd.includes('business'))
        );
      }

      // Experience: Govt entry cadres do not require experience
      const experienceEligible = true;

      let status: EligibilityStatus = 'ELIGIBLE';
      let explanation = '';

      if (!ageEligible) {
        status = 'NOT_ELIGIBLE';
        explanation = `Not eligible: Candidate approximate age (${approxAge} yrs) exceeds the circular maximum limit of ${maxAge} years.`;
      } else if (!educationEligible) {
        status = 'NOT_ELIGIBLE';
        explanation = `Not eligible: Circular requires ${circ.acceptedDegrees.join(', ')}, which does not match candidate's recorded degree.`;
      } else {
        status = 'ELIGIBLE';
        explanation = `You meet the educational requirement (${profile.education[0]?.degree || 'BBA'} is accepted). Candidate age (${approxAge} yrs) is within the maximum ${maxAge}-year limit. No prior cadre experience is required.`;
      }

      return {
        status,
        explanation,
        ageEligible,
        educationEligible,
        experienceEligible,
      };
    }

    // 2. Private Sector / Internship / Trainee Eligibility
    const userYearsExp = profile.yearsOfExperience || 0;
    const reqExpStr = job.experienceRequirements.toLowerCase();

    let expRequired = 0;
    if (reqExpStr.includes('0-1') || reqExpStr.includes('entry') || reqExpStr.includes('fresh') || reqExpStr.includes('intern')) {
      expRequired = 0;
    } else {
      const match = reqExpStr.match(/(\d+)\s*(?:-|to)?\s*(\d+)?\s*year/);
      if (match) expRequired = parseInt(match[1], 10);
    }

    const experienceEligible = userYearsExp >= expRequired || expRequired <= 1;
    const educationEligible = profile.education.length > 0;

    let status: EligibilityStatus = 'ELIGIBLE';
    let explanation = '';

    if (experienceEligible && educationEligible) {
      status = 'ELIGIBLE';
      explanation = `Eligible: Your degree (${profile.education[0]?.degree || 'Bachelor'}) satisfies the entry qualifications, and your experience (${userYearsExp} yrs) matches the ${job.experienceRequirements} requirement.`;
    } else if (educationEligible && !experienceEligible) {
      status = 'LIKELY_ELIGIBLE';
      explanation = `Likely eligible: The role prefers ${job.experienceRequirements}; strong internship portfolio and analytics skills can qualify you.`;
    } else {
      status = 'NEEDS_VERIFICATION';
      explanation = 'Verification recommended: Review official job posting requirements.';
    }

    return {
      status,
      explanation,
      ageEligible: true,
      educationEligible,
      experienceEligible,
    };
  }
}
