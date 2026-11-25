import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobNormalizer } from '@/lib/agents/job-discovery/normalizer';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'ALL'; // ALL, RECOMMENDED, PRIVATE, GOVERNMENT, INTERNSHIP, TRAINEE
    const urgency = searchParams.get('urgency'); // URGENT, HIGH, MEDIUM, NORMAL
    const minSalary = searchParams.get('minSalary');

    const education = searchParams.get('education')?.toUpperCase() || 'ALL'; // ALL, BBA, MBA, CSE, MIS, GRADUATION, HONORS
    const experience = searchParams.get('experience')?.toUpperCase() || 'ALL'; // ALL, FRESHER, 0_1, 1_3
    const sector = searchParams.get('sector')?.toUpperCase() || 'ALL'; // ALL, BANKING, TECH, FMCG, GOVERNMENT, PRIVATE
    const myProfileMatch = searchParams.get('myProfileMatch') === 'true';

    const profile = await prisma.userProfile.findFirst();

    const jobs = await prisma.job.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        governmentCircular: true,
        matches: profile ? { where: { profileId: profile.id } } : true,
      },
      orderBy: {
        applicationDeadline: 'asc',
      },
    });

    const enrichedJobs = jobs.map((job) => {
      const match = job.matches[0];
      const urgencyLevel = JobNormalizer.getUrgency(job.applicationDeadline.toISOString());

      return {
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
      };
    });

    // Apply Filters
    let filtered = enrichedJobs;

    // 1. Semantic Multi-Token Query Parser
    if (query) {
      const tokens = query.split(/\s+/).filter(Boolean);
      filtered = filtered.filter((j) => {
        const corpus = [
          j.title,
          j.company,
          j.location,
          j.organizationType || '',
          j.educationRequirements || '',
          j.experienceRequirements || '',
          j.description || '',
          ...(j.responsibilities || []),
          ...(j.requirements || []),
          ...(j.requiredSkills || []),
          ...(j.preferredSkills || []),
          j.governmentCircular?.educationalQualification || '',
          ...(j.governmentCircular?.acceptedDegrees || []),
        ]
          .join(' ')
          .toLowerCase();

        return tokens.every((token) => {
          if (token === 'fresher' || token === 'freshers') {
            return (
              corpus.includes('fresh') ||
              corpus.includes('0-1') ||
              corpus.includes('0 year') ||
              corpus.includes('trainee') ||
              corpus.includes('intern')
            );
          }
          if (token === 'bank' || token === 'banking') {
            return (
              corpus.includes('bank') ||
              corpus.includes('mfs') ||
              corpus.includes('fintech') ||
              corpus.includes('financial')
            );
          }
          if (token === 'bba') {
            return corpus.includes('bba') || corpus.includes('business administration');
          }
          if (token === 'mba') {
            return corpus.includes('mba') || corpus.includes('master');
          }
          if (token === 'cse') {
            return (
              corpus.includes('cse') ||
              corpus.includes('computer science') ||
              corpus.includes('software') ||
              corpus.includes('it')
            );
          }
          if (token === 'mis') {
            return (
              corpus.includes('mis') ||
              corpus.includes('management information systems') ||
              corpus.includes('information systems')
            );
          }
          if (token === '0-1' || token === '0-1yr' || token === '0-1year') {
            return (
              corpus.includes('0-1') ||
              corpus.includes('0 to 1') ||
              corpus.includes('fresh') ||
              corpus.includes('0 year')
            );
          }
          return corpus.includes(token);
        });
      });
    }

    // 2. Education / Degree Filter
    if (education !== 'ALL') {
      filtered = filtered.filter((j) => {
        const eduText = [
          j.educationRequirements || '',
          ...(j.requirements || []),
          j.governmentCircular?.educationalQualification || '',
          ...(j.governmentCircular?.acceptedDegrees || []),
        ]
          .join(' ')
          .toLowerCase();

        if (education === 'BBA') {
          return eduText.includes('bba') || eduText.includes('business administration');
        }
        if (education === 'MBA') {
          return eduText.includes('mba') || eduText.includes('master');
        }
        if (education === 'CSE') {
          return (
            eduText.includes('cse') ||
            eduText.includes('computer science') ||
            eduText.includes('software') ||
            eduText.includes('ict') ||
            eduText.includes('it')
          );
        }
        if (education === 'MIS') {
          return (
            eduText.includes('mis') ||
            eduText.includes('management information systems') ||
            eduText.includes('information systems')
          );
        }
        if (education === 'HONORS' || education === 'GRADUATION') {
          return (
            eduText.includes('bachelor') ||
            eduText.includes('honors') ||
            eduText.includes('graduation') ||
            eduText.includes('graduate')
          );
        }
        return true;
      });
    }

    // 3. Experience Bracket Filter
    if (experience !== 'ALL') {
      filtered = filtered.filter((j) => {
        const expText = [
          j.experienceRequirements || '',
          ...(j.requirements || []),
          j.governmentCircular?.requiredExperience || '',
          j.jobType,
        ]
          .join(' ')
          .toLowerCase();

        if (experience === 'FRESHER' || experience === '0_1') {
          return (
            expText.includes('fresh') ||
            expText.includes('0-1') ||
            expText.includes('0 to 1') ||
            expText.includes('0 year') ||
            expText.includes('not required') ||
            expText.includes('no prior') ||
            j.jobType === 'INTERNSHIP' ||
            j.jobType === 'TRAINEE'
          );
        }
        if (experience === '1_3') {
          return expText.includes('1-3') || expText.includes('1 to 3') || expText.includes('2 year');
        }
        return true;
      });
    }

    // 4. Sector / Industry Filter
    if (sector !== 'ALL') {
      filtered = filtered.filter((j) => {
        const secText = [
          j.organizationType || '',
          j.company,
          j.source,
          j.jobType,
        ]
          .join(' ')
          .toLowerCase();

        if (sector === 'BANKING') {
          return (
            secText.includes('bank') ||
            secText.includes('financial') ||
            secText.includes('fintech') ||
            secText.includes('mfs')
          );
        }
        if (sector === 'TECH') {
          return (
            secText.includes('tech') ||
            secText.includes('software') ||
            secText.includes('it') ||
            secText.includes('startup')
          );
        }
        if (sector === 'FMCG') {
          return (
            secText.includes('fmcg') ||
            secText.includes('mnc') ||
            secText.includes('consumer')
          );
        }
        if (sector === 'GOVERNMENT') {
          return j.jobType === 'GOVERNMENT' || secText.includes('government') || secText.includes('central bank');
        }
        if (sector === 'PRIVATE') {
          return j.jobType === 'PRIVATE';
        }
        return true;
      });
    }

    // 5. Smart "My Profile Match" Preset
    if (myProfileMatch) {
      filtered = filtered.filter((j) => {
        const edu = (j.educationRequirements + ' ' + (j.requirements || []).join(' ')).toLowerCase();
        const exp = (j.experienceRequirements + ' ' + j.jobType).toLowerCase();
        const matchesEdu =
          edu.includes('bba') ||
          edu.includes('mis') ||
          edu.includes('business') ||
          edu.includes('bachelor');
        const matchesExp =
          exp.includes('0-1') ||
          exp.includes('fresh') ||
          exp.includes('not required') ||
          j.jobType === 'INTERNSHIP' ||
          j.jobType === 'TRAINEE' ||
          (j.match?.overallScore || 0) >= 85;
        return matchesEdu && matchesExp;
      });
    }

    if (category === 'RECOMMENDED') {
      filtered = filtered.filter((j) => (j.match?.overallScore || 0) >= 85);
    } else if (category !== 'ALL') {
      filtered = filtered.filter((j) => j.jobType === category);
    }

    if (urgency) {
      filtered = filtered.filter((j) => j.urgencyLevel === urgency);
    }

    if (minSalary) {
      const minVal = Number(minSalary);
      filtered = filtered.filter((j) => (j.minSalary || 0) >= minVal);
    }

    // Sort by Match Score descending, then Urgency
    filtered.sort((a, b) => {
      const scoreA = a.match?.overallScore || 0;
      const scoreB = b.match?.overallScore || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
    });

    return NextResponse.json({ jobs: filtered });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
