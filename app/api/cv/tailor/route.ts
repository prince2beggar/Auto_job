import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CVTailoringAgent } from '@/lib/agents/cv-tailoring-agent';
import { LatexTemplateAgent } from '@/lib/agents/latex-template-agent';
import { CandidateProfile, NormalizedJob } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { jobId, saveVersion } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { governmentCircular: true },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const profileRecord = await prisma.userProfile.findFirst({
      include: {
        educations: true,
        experiences: true,
        skills: true,
        projects: true,
        careerPreferences: true,
        masterCvs: true,
        certifications: true,
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
      address: profileRecord.address || undefined,
      linkedin: profileRecord.linkedin || undefined,
      github: profileRecord.github || undefined,
      portfolio: profileRecord.portfolio || undefined,
      bio: profileRecord.bio || undefined,
      yearsOfExperience: profileRecord.yearsOfExperience,
      completionPercentage: profileRecord.completionPercentage,
      missingFields: JSON.parse(profileRecord.missingFields || '[]'),
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
        location: exp.location || undefined,
        employmentType: exp.employmentType || undefined,
        startDate: exp.startDate || undefined,
        endDate: exp.endDate || undefined,
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
        outcome: p.outcome || undefined,
      })),
      certifications: profileRecord.certifications.map((c) => ({
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate || undefined,
        credentialUrl: c.credentialUrl || undefined,
      })),
    };

    const normalizedJob: NormalizedJob = {
      id: job.id,
      source: job.source,
      sourceUrl: job.sourceUrl || undefined,
      jobType: job.jobType as any,
      title: job.title,
      company: job.company,
      country: job.country,
      city: job.city || undefined,
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
      salary: job.salary || undefined,
      currency: job.currency,
      applicationDeadline: job.applicationDeadline.toISOString(),
      applicationMethod: job.applicationMethod as any,
      recruiterEmail: job.recruiterEmail || undefined,
      postedDate: job.postedDate.toISOString(),
      status: job.status as any,
    };

    const tailoredDirection = await CVTailoringAgent.tailorCV(profile, normalizedJob);

    let savedVersionId: string | undefined;
    if (saveVersion) {
      const defaultMaster = profileRecord.masterCvs.find((m) => m.isDefault) || profileRecord.masterCvs[0];
      const version = await prisma.cVVersion.create({
        data: {
          profileId: profileRecord.id,
          masterCvId: defaultMaster?.id,
          jobId: job.id,
          title: `Tailored CV for ${job.title} at ${job.company}`,
          tailoredSummary: tailoredDirection.tailoredSummary,
          tailoredSkills: JSON.stringify(tailoredDirection.orderedSkills),
          tailoredExperience: JSON.stringify(tailoredDirection.highlightedExperiences),
          tailoredProjects: JSON.stringify(tailoredDirection.highlightedProjects),
          changesSummary: JSON.stringify(tailoredDirection.changesSummary),
          isApproved: true,
        },
      });
      savedVersionId = version.id;

      // Update application status if application exists
      const existingApp = await prisma.application.findUnique({
        where: {
          profileId_jobId: {
            profileId: profileRecord.id,
            jobId: job.id,
          },
        },
      });

      if (existingApp) {
        await prisma.application.update({
          where: { id: existingApp.id },
          data: {
            status: 'CV_GENERATED',
            cvVersionId: version.id,
          },
        });

        await prisma.applicationEvent.create({
          data: {
            applicationId: existingApp.id,
            eventType: 'CV_TAILORED',
            title: 'Truth-Preserving CV Generated & Saved',
            description: `Tailored resume prepared for ${job.company}. Preserved authentic facts with reordered skills and customized summary.`,
          },
        });
      }
    }

    const latexCode = LatexTemplateAgent.generateOverleafLatex(profile, normalizedJob, tailoredDirection);

    return NextResponse.json({
      success: true,
      tailored: tailoredDirection,
      latexCode,
      savedVersionId,
    });
  } catch (error) {
    console.error('Error in CV tailor route:', error);
    return NextResponse.json({ error: 'Failed to tailor CV' }, { status: 500 });
  }
}
