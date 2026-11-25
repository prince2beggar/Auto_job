import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobNormalizer } from '@/lib/agents/job-discovery/normalizer';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const profile = await prisma.userProfile.findFirst();

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        governmentCircular: true,
        matches: profile ? { where: { profileId: profile.id } } : true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const match = job.matches[0];
    const urgencyLevel = JobNormalizer.getUrgency(job.applicationDeadline.toISOString());

    return NextResponse.json({
      job: {
        id: job.id,
        source: job.source,
        sourceUrl: job.sourceUrl,
        jobType: job.jobType,
        title: job.title,
        company: job.company,
        organizationType: job.organizationType,
        country: job.country,
        city: job.city,
        location: job.location,
        remoteType: job.remoteType,
        employmentType: job.employmentType,
        description: job.description,
        responsibilities: JSON.parse(job.responsibilities || '[]'),
        requirements: JSON.parse(job.requirements || '[]'),
        preferredRequirements: JSON.parse(job.preferredRequirements || '[]'),
        educationRequirements: job.educationRequirements,
        experienceRequirements: job.experienceRequirements,
        requiredSkills: JSON.parse(job.requiredSkills || '[]'),
        preferredSkills: JSON.parse(job.preferredSkills || '[]'),
        salary: job.salary,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        currency: job.currency,
        applicationDeadline: job.applicationDeadline.toISOString(),
        applicationMethod: job.applicationMethod,
        applicationUrl: job.applicationUrl,
        recruiterEmail: job.recruiterEmail,
        postedDate: job.postedDate.toISOString(),
        status: job.status,
        governmentCircular: job.governmentCircular
          ? {
              ...job.governmentCircular,
              acceptedDegrees: JSON.parse(job.governmentCircular.acceptedDegrees || '[]'),
            }
          : undefined,
        match: match
          ? {
              overallScore: match.overallScore,
              educationScore: match.educationScore,
              experienceScore: match.experienceScore,
              skillsScore: match.skillsScore,
              roleScore: match.roleScore,
              locationScore: match.locationScore,
              eligibilityStatus: match.eligibilityStatus,
              eligibilityExplanation: match.eligibilityExplanation,
              matchReasons: JSON.parse(match.matchReasons || '[]'),
              gaps: JSON.parse(match.gaps || '[]'),
            }
          : undefined,
        urgencyLevel,
      },
    });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return NextResponse.json({ error: 'Failed to fetch job details' }, { status: 500 });
  }
}
