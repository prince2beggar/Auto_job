import { CandidateProfile, NormalizedJob, MatchAssessment } from '../types';
import { EligibilityAgent } from './eligibility-agent';
import { JobNormalizer } from './job-discovery/normalizer';
import { generateJSON } from '../ai/gemini';

export class MatchingAgent {
  /**
   * Computes multi-dimensional match score and grounded explanations.
   */
  static async calculateMatch(
    profile: CandidateProfile,
    job: NormalizedJob
  ): Promise<MatchAssessment> {
    const urgency = JobNormalizer.getUrgency(job.applicationDeadline);
    const eligibility = EligibilityAgent.evaluateEligibility(profile, job);

    const systemPrompt = `You are an AI Job Matching & Grounding Agent.
Analyze the candidate profile against the normalized job opportunity.
Return a structured JSON assessment:
{
  "overallScore": number (0-100),
  "educationScore": number (0-100),
  "experienceScore": number (0-100),
  "skillsScore": number (0-100),
  "roleScore": number (0-100),
  "locationScore": number (0-100),
  "matchReasons": string[] (3-5 bullet points grounded STRICTLY in candidate's real data and job requirements),
  "gaps": string[] (1-3 minor areas of development)
}`;

    const fallback = (): MatchAssessment => {
      // 1. Education Match (0-100)
      let educationScore = 70;
      const userDegrees = profile.education.map(e => `${e.degree} ${e.major || ''}`.toLowerCase()).join(' ');
      const reqEdu = (job.educationRequirements || '').toLowerCase();
      if (userDegrees.includes('bba') || userDegrees.includes('business') || userDegrees.includes('mis')) {
        if (reqEdu.includes('bba') || reqEdu.includes('business') || reqEdu.includes('any') || reqEdu.includes('bachelor')) {
          educationScore = 95;
        } else {
          educationScore = 80;
        }
      }

      // 2. Experience Match (0-100)
      let experienceScore = 80;
      const userExp = profile.yearsOfExperience || 0;
      const reqExp = job.experienceRequirements.toLowerCase();
      if (reqExp.includes('0-1') || reqExp.includes('fresh') || reqExp.includes('intern') || reqExp.includes('entry') || reqExp.includes('not required')) {
        experienceScore = 95;
      } else if (userExp >= 1) {
        experienceScore = 85;
      } else {
        experienceScore = 70;
      }

      // 3. Skills Match (0-100)
      const userSkillNames = profile.skills.map(s => s.name.toLowerCase());
      const jobRequiredSkills = job.requiredSkills.map(s => s.toLowerCase());
      let matchedSkillCount = 0;
      for (const reqSkill of jobRequiredSkills) {
        if (userSkillNames.some(us => us.includes(reqSkill) || reqSkill.includes(us))) {
          matchedSkillCount++;
        }
      }
      const skillsScore = jobRequiredSkills.length > 0
        ? Math.min(100, Math.round((matchedSkillCount / jobRequiredSkills.length) * 100))
        : 85;

      // 4. Role Match (0-100)
      let roleScore = 75;
      const targetTitles = profile.careerPreferences?.targetTitles.map(t => t.toLowerCase()) || ['business analyst', 'data analyst'];
      const jobTitleLower = job.title.toLowerCase();
      if (targetTitles.some(tt => jobTitleLower.includes(tt) || tt.includes(jobTitleLower.split(' ')[0]))) {
        roleScore = 95;
      } else if (jobTitleLower.includes('analyst') || jobTitleLower.includes('executive') || jobTitleLower.includes('trainee')) {
        roleScore = 85;
      }

      // 5. Location Match (0-100)
      let locationScore = 80;
      const preferredLocations = profile.careerPreferences?.locations.map(l => l.toLowerCase()) || ['dhaka', 'remote'];
      const jobLoc = job.location.toLowerCase();
      if (job.remoteType === 'Remote' || preferredLocations.some(pl => jobLoc.includes(pl))) {
        locationScore = 100;
      } else if (job.remoteType === 'Hybrid') {
        locationScore = 90;
      }

      // Weighted Overall Score:
      // Skills: 30%, Experience: 25%, Education: 20%, Role: 15%, Location: 10%
      const overallScore = Math.round(
        skillsScore * 0.3 +
        experienceScore * 0.25 +
        educationScore * 0.2 +
        roleScore * 0.15 +
        locationScore * 0.1
      );

      // Grounded Reasons
      const matchReasons: string[] = [];
      if (profile.education.length > 0) {
        matchReasons.push(
          `Your ${profile.education[0].degree} degree (${profile.education[0].institution}) directly satisfies the educational requirement.`
        );
      }
      if (matchedSkillCount > 0) {
        matchReasons.push(
          `Matches ${matchedSkillCount} of the core required skills (${job.requiredSkills.slice(0, 3).join(', ')}).`
        );
      }
      if (experienceScore >= 85) {
        matchReasons.push(
          `The role welcomes fresh graduates and candidates with 0-1 year experience, which fits your profile.`
        );
      }
      if (locationScore >= 90) {
        matchReasons.push(
          `Location (${job.location}) perfectly aligns with your preferred city (${profile.city || 'Dhaka'}).`
        );
      }

      const gaps: string[] = [];
      for (const prefSkill of job.preferredSkills) {
        if (!userSkillNames.some(us => us.includes(prefSkill.toLowerCase()))) {
          gaps.push(`Preferred tool "${prefSkill}" is not explicitly listed on your CV.`);
          break;
        }
      }

      return {
        overallScore,
        educationScore,
        experienceScore,
        skillsScore,
        roleScore,
        locationScore,
        eligibilityStatus: eligibility.status,
        eligibilityExplanation: eligibility.explanation,
        matchReasons,
        gaps,
        urgencyLevel: urgency,
      };
    };

    const userPrompt = `Candidate Profile:
Education: ${JSON.stringify(profile.education)}
Experience: ${JSON.stringify(profile.experience)}
Skills: ${JSON.stringify(profile.skills.map(s => s.name))}
Target Roles: ${JSON.stringify(profile.careerPreferences?.targetTitles)}
Preferred Location: ${profile.city}, ${profile.country}

Job Opportunity:
Title: ${job.title}
Company: ${job.company}
Job Type: ${job.jobType}
Location: ${job.location} (${job.remoteType})
Education Req: ${job.educationRequirements}
Experience Req: ${job.experienceRequirements}
Required Skills: ${JSON.stringify(job.requiredSkills)}
Preferred Skills: ${JSON.stringify(job.preferredSkills)}`;

    const assessment = await generateJSON<MatchAssessment>(
      systemPrompt,
      userPrompt,
      fallback
    );

    // Overwrite deterministic eligibility and urgency fields
    assessment.eligibilityStatus = eligibility.status;
    assessment.eligibilityExplanation = eligibility.explanation;
    assessment.urgencyLevel = urgency;

    return assessment;
  }
}
