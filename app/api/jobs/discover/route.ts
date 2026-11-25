import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobNormalizer } from '@/lib/agents/job-discovery/normalizer';
import { MatchingAgent } from '@/lib/agents/matching-agent';
import { CandidateProfile } from '@/lib/types';

export async function POST() {
  try {
    const discoveredJobs = await JobNormalizer.discoverAllJobs();
    const profileRecord = await prisma.userProfile.findFirst({
      include: {
        educations: true,
        experiences: true,
        skills: true,
        projects: true,
        careerPreferences: true,
      },
    });

    let newJobsCount = 0;

    for (const j of discoveredJobs) {
      const existing = await prisma.job.findUnique({
        where: { id: j.id },
      });

      if (!existing) {
        newJobsCount++;
        const createdJob = await prisma.job.create({
          data: {
            id: j.id,
            source: j.source,
            sourceUrl: j.sourceUrl,
            jobType: j.jobType,
            title: j.title,
            company: j.company,
            organizationType: j.organizationType || 'Private',
            country: j.country,
            city: j.city,
            location: j.location,
            remoteType: j.remoteType,
            employmentType: j.employmentType,
            description: j.description,
            responsibilities: JSON.stringify(j.responsibilities),
            requirements: JSON.stringify(j.requirements),
            preferredRequirements: JSON.stringify(j.preferredRequirements),
            educationRequirements: j.educationRequirements,
            experienceRequirements: j.experienceRequirements,
            requiredSkills: JSON.stringify(j.requiredSkills),
            preferredSkills: JSON.stringify(j.preferredSkills),
            salary: j.salary,
            minSalary: j.minSalary,
            maxSalary: j.maxSalary,
            currency: j.currency,
            applicationDeadline: new Date(j.applicationDeadline),
            applicationStartDate: j.applicationStartDate ? new Date(j.applicationStartDate) : new Date(),
            applicationMethod: j.applicationMethod,
            applicationUrl: j.applicationUrl,
            recruiterEmail: j.recruiterEmail,
            postedDate: new Date(j.postedDate),
            status: j.status,
          },
        });

        if (j.governmentCircular) {
          await prisma.governmentCircular.create({
            data: {
              jobId: createdJob.id,
              recruitingOrganization: j.governmentCircular.recruitingOrganization,
              ministry: j.governmentCircular.ministry,
              postTitle: j.governmentCircular.postTitle,
              vacancies: j.governmentCircular.vacancies,
              educationalQualification: j.governmentCircular.educationalQualification,
              acceptedDegrees: JSON.stringify(j.governmentCircular.acceptedDegrees),
              requiredExperience: j.governmentCircular.requiredExperience,
              ageLimit: j.governmentCircular.ageLimit,
              maxAge: j.governmentCircular.maxAge,
              quotaAgeLimit: j.governmentCircular.quotaAgeLimit,
              quotaInformation: j.governmentCircular.quotaInformation,
              districtEligibility: j.governmentCircular.districtEligibility,
              applicationFee: j.governmentCircular.applicationFee,
              paymentMethod: j.governmentCircular.paymentMethod,
              circularNumber: j.governmentCircular.circularNumber,
              circularPdfUrl: j.governmentCircular.circularPdfUrl,
              applicationWebsite: j.governmentCircular.applicationWebsite,
            },
          });
        }

        // Calculate match if profile exists
        if (profileRecord) {
          const profile: CandidateProfile = {
            fullName: profileRecord.fullName,
            email: profileRecord.email,
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
            careerPreferences: profileRecord.careerPreferences
              ? {
                  targetTitles: JSON.parse(profileRecord.careerPreferences.targetTitles || '[]'),
                  targetIndustries: JSON.parse(profileRecord.careerPreferences.targetIndustries || '[]'),
                  experienceLevel: profileRecord.careerPreferences.experienceLevel,
                  jobTypes: JSON.parse(profileRecord.careerPreferences.jobTypes || '[]'),
                  locations: JSON.parse(profileRecord.careerPreferences.locations || '[]'),
                  remotePreference: profileRecord.careerPreferences.remotePreference,
                  currency: profileRecord.careerPreferences.currency,
                  salaryNegotiable: profileRecord.careerPreferences.salaryNegotiable,
                  preferredOrgTypes: JSON.parse(profileRecord.careerPreferences.preferredOrgTypes || '[]'),
                }
              : undefined,
          };

          const match = await MatchingAgent.calculateMatch(profile, j);
          await prisma.jobMatch.create({
            data: {
              profileId: profileRecord.id,
              jobId: createdJob.id,
              overallScore: match.overallScore,
              educationScore: match.educationScore,
              experienceScore: match.experienceScore,
              skillsScore: match.skillsScore,
              roleScore: match.roleScore,
              locationScore: match.locationScore,
              eligibilityStatus: match.eligibilityStatus,
              eligibilityExplanation: match.eligibilityExplanation,
              matchReasons: JSON.stringify(match.matchReasons),
              gaps: JSON.stringify(match.gaps),
              urgencyLevel: match.urgencyLevel,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalDiscovered: discoveredJobs.length,
      newJobsCount,
    });
  } catch (error) {
    console.error('Error running job discovery sync:', error);
    return NextResponse.json({ error: 'Failed to run job discovery' }, { status: 500 });
  }
}
