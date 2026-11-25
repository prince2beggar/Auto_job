import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailAgent } from '@/lib/agents/email-agent';
import { CandidateProfile, NormalizedJob } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const profileRecord = await prisma.userProfile.findFirst({
      include: {
        educations: true,
        experiences: true,
        skills: true,
        projects: true,
      },
    });

    if (!profileRecord) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const profile: CandidateProfile = {
      fullName: profileRecord.fullName,
      email: profileRecord.email,
      phone: profileRecord.phone || undefined,
      country: profileRecord.country,
      city: profileRecord.city || undefined,
      yearsOfExperience: profileRecord.yearsOfExperience,
      completionPercentage: profileRecord.completionPercentage,
      missingFields: [],
      education: profileRecord.educations.map((e) => ({
        degree: e.degree,
        major: e.major || undefined,
        institution: e.institution,
        graduationYear: e.graduationYear || undefined,
        cgpa: e.cgpa || undefined,
        provenance: e.provenance as any,
      })),
      experience: profileRecord.experiences.map((exp) => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        responsibilities: JSON.parse(exp.responsibilities || '[]'),
        achievements: JSON.parse(exp.achievements || '[]'),
        technologies: JSON.parse(exp.technologies || '[]'),
        provenance: exp.provenance as any,
      })),
      skills: profileRecord.skills.map((s) => ({
        name: s.name,
        category: s.category as any,
        provenance: s.provenance as any,
      })),
      projects: profileRecord.projects.map((p) => ({
        name: p.name,
        description: p.description,
        tools: JSON.parse(p.tools || '[]'),
      })),
    };

    const normalizedJob: NormalizedJob = {
      id: job.id,
      source: job.source,
      jobType: job.jobType as any,
      title: job.title,
      company: job.company,
      country: job.country,
      location: job.location,
      remoteType: job.remoteType as any,
      employmentType: job.employmentType,
      description: job.description,
      responsibilities: JSON.parse(job.responsibilities || '[]'),
      requirements: JSON.parse(job.requirements || '[]'),
      preferredRequirements: JSON.parse(job.preferredRequirements || '[]'),
      educationRequirements: job.educationRequirements,
      experienceRequirements: job.experienceRequirements,
      requiredSkills: JSON.parse(job.requiredSkills || '[]'),
      preferredSkills: JSON.parse(job.preferredSkills || '[]'),
      currency: job.currency,
      applicationDeadline: job.applicationDeadline.toISOString(),
      applicationMethod: job.applicationMethod as any,
      recruiterEmail: job.recruiterEmail || undefined,
      postedDate: job.postedDate.toISOString(),
      status: job.status as any,
    };

    const draft = EmailAgent.prepareEmailDraft(profile, normalizedJob);

    // Save or update EmailDraft in database
    const existingDraft = await prisma.emailDraft.findFirst({
      where: { profileId: profileRecord.id, jobId: job.id },
    });

    if (existingDraft) {
      await prisma.emailDraft.update({
        where: { id: existingDraft.id },
        data: {
          toEmail: draft.toEmail,
          subject: draft.subject,
          body: draft.body,
          attachmentName: draft.attachmentName,
        },
      });
    } else {
      await prisma.emailDraft.create({
        data: {
          profileId: profileRecord.id,
          jobId: job.id,
          toEmail: draft.toEmail,
          subject: draft.subject,
          body: draft.body,
          attachmentName: draft.attachmentName,
          isApproved: false,
        },
      });
    }

    return NextResponse.json({ success: true, draft });
  } catch (error) {
    console.error('Error preparing email:', error);
    return NextResponse.json({ error: 'Failed to prepare email draft' }, { status: 500 });
  }
}
