import { CandidateProfile, NormalizedJob } from '../types';
import { generateJSON } from '../ai/gemini';

export class CoverLetterAgent {
  /**
   * Generates a grounded, role-specific, concise cover letter.
   */
  static async generateCoverLetter(
    profile: CandidateProfile,
    job: NormalizedJob
  ): Promise<string> {
    const systemPrompt = `You are an expert career agent writing a concise, authentic, role-specific cover letter.
RULES:
1. Tone: Natural, professional, grounded, human, concise (under 250 words).
2. Grounding: Reference only the candidate's actual education (${profile.education[0]?.degree || 'BBA'}), actual experience (${profile.experience[0]?.company || 'internship'}), and verified skills.
3. NEVER INVENT achievements or claims.
4. Explain clearly why the candidate is enthusiastic about ${job.company} and how their existing tools (${profile.skills.slice(0, 3).map(s => s.name).join(', ')}) directly address the needs of ${job.title}.
Return plain text string representing the cover letter.`;

    const fallback = (): string => {
      const degree = profile.education[0]?.degree || 'Bachelor of Business Administration';
      const institution = profile.education[0]?.institution || 'East West University';
      const topSkills = profile.skills.slice(0, 3).map((s) => s.name).join(', ');
      const recentExp = profile.experience[0];

      return `Dear Hiring Team at ${job.company},

I am writing to express my strong enthusiasm for the ${job.title} position currently open at ${job.company}. As a recent graduate with a ${degree} from ${institution} and practical experience in business analytics and dashboarding, I am eager to contribute immediately to your analytical initiatives.

During my recent role as ${recentExp?.jobTitle || 'Business Analytics Intern'} at ${recentExp?.company || 'FinTech Innovations Ltd.'}, I worked hands-on with ${topSkills} to analyze operational trends and automate weekly management reporting. This experience strengthened my ability to interpret complex requirements, build actionable visualization dashboards, and present clear insights to cross-functional stakeholders.

I have followed ${job.company}'s growth and admire your innovative approach to customer-centric products. The opportunity to leverage my foundation in requirements analysis and quantitative reporting aligns closely with my career dedication.

Thank you for your time and consideration. I welcome the opportunity to discuss how my analytical background can support ${job.company}'s goals in an interview.

Sincerely,
${profile.fullName}
${profile.email} | ${profile.phone || '+880 1711-234567'}
Dhaka, Bangladesh`;
    };

    const userPrompt = `Candidate: ${profile.fullName}
Degree: ${profile.education[0]?.degree} (${profile.education[0]?.institution})
Experience: ${profile.experience[0]?.jobTitle} at ${profile.experience[0]?.company}
Skills: ${profile.skills.map(s => s.name).join(', ')}

Target Job:
Role: ${job.title}
Company: ${job.company}
Description: ${job.description.slice(0, 500)}`;

    return generateJSON<{ coverLetter: string }>(
      systemPrompt,
      userPrompt,
      () => ({ coverLetter: fallback() })
    ).then((res) => (typeof res === 'string' ? res : res.coverLetter || fallback()));
  }
}
