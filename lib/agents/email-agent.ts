import { CandidateProfile, NormalizedJob } from '../types';

export interface PreparedEmailDraft {
  toEmail: string;
  subject: string;
  body: string;
  attachmentName: string;
  gmailComposeUrl: string;
  mailtoUrl: string;
}

export class EmailAgent {
  /**
   * Prepares a complete email application package for human review and approval.
   * Safety invariant: Never triggers network transmission without user confirmation.
   */
  static prepareEmailDraft(
    profile: CandidateProfile,
    job: NormalizedJob,
    tailoredSummary?: string
  ): PreparedEmailDraft {
    const toEmail =
      job.recruiterEmail ||
      (job.company.toLowerCase().includes('bkash')
        ? 'careers.analytics@bkash.com'
        : job.company.toLowerCase().includes('pathao')
        ? 'talent@pathao.com'
        : `recruitment@${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);

    const cleanCandidateName = profile.fullName.replace(/\s+/g, '_');
    const cleanJobTitle = job.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const attachmentName = `${cleanCandidateName}_${cleanJobTitle}_CV.pdf`;

    const subject = `Job Application: ${job.title} - ${profile.fullName}`;

    const body = `Dear Hiring Team at ${job.company},

Please accept my application for the ${job.title} opportunity currently open at your organization.

I hold a ${profile.education[0]?.degree || 'Bachelor of Business Administration (BBA)'} from ${profile.education[0]?.institution || 'East West University'} (CGPA ${profile.education[0]?.cgpa || '3.53'}) and have hands-on experience in ${profile.skills.slice(0, 3).map(s => s.name).join(', ')}. In my recent analytics internship, I developed executive dashboards and analyzed operational datasets to deliver actionable business insights.

I have attached my tailored resume (${attachmentName}) for your review. I would welcome the opportunity to discuss in an interview how my skills and analytical enthusiasm can support ${job.company}.

Thank you for your time and consideration.

Best regards,

${profile.fullName}
${profile.email} | ${profile.phone || '+880 1711-234567'}
LinkedIn: ${profile.linkedin || 'Available upon request'}
Dhaka, Bangladesh`;

    // Construct web compose links for instant user dispatch
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const encodedTo = encodeURIComponent(toEmail);

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}`;

    return {
      toEmail,
      subject,
      body,
      attachmentName,
      gmailComposeUrl,
      mailtoUrl,
    };
  }
}
