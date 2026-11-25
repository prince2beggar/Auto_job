import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProfileAgent } from '@/lib/agents/profile-agent';
import { LatexTemplateAgent } from '@/lib/agents/latex-template-agent';
import { CandidateProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profile = await prisma.userProfile.findFirst({
      include: {
        educations: true,
        experiences: true,
        skills: true,
        projects: true,
        careerPreferences: true,
        masterCvs: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { score, missingFields } = ProfileAgent.calculateCompletion({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone || undefined,
      city: profile.city || undefined,
      education: profile.educations.map((e) => ({
        degree: e.degree,
        major: e.major || undefined,
        institution: e.institution,
        graduationYear: e.graduationYear || undefined,
        cgpa: e.cgpa || undefined,
        provenance: e.provenance as any,
      })),
      experience: profile.experiences.map((exp) => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        location: exp.location || undefined,
        responsibilities: JSON.parse(exp.responsibilities || '[]'),
        achievements: JSON.parse(exp.achievements || '[]'),
        technologies: JSON.parse(exp.technologies || '[]'),
        provenance: exp.provenance as any,
      })),
      skills: profile.skills.map((s) => ({
        name: s.name,
        category: s.category as any,
        provenance: s.provenance as any,
      })),
      projects: profile.projects.map((p) => ({
        name: p.name,
        description: p.description,
        tools: JSON.parse(p.tools || '[]'),
        outcome: p.outcome || undefined,
      })),
      careerPreferences: profile.careerPreferences
        ? {
            targetTitles: JSON.parse(profile.careerPreferences.targetTitles || '[]'),
            targetIndustries: JSON.parse(profile.careerPreferences.targetIndustries || '[]'),
            experienceLevel: profile.careerPreferences.experienceLevel,
            jobTypes: JSON.parse(profile.careerPreferences.jobTypes || '[]'),
            locations: JSON.parse(profile.careerPreferences.locations || '[]'),
            remotePreference: profile.careerPreferences.remotePreference,
            minSalary: profile.careerPreferences.minSalary || undefined,
            currency: profile.careerPreferences.currency,
            salaryNegotiable: profile.careerPreferences.salaryNegotiable,
            preferredOrgTypes: JSON.parse(profile.careerPreferences.preferredOrgTypes || '[]'),
            naturalLanguageGoal: profile.careerPreferences.naturalLanguageGoal || undefined,
          }
        : undefined,
    });

    const candidateProfile: CandidateProfile = {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone || undefined,
      country: profile.country,
      city: profile.city || undefined,
      address: profile.address || undefined,
      linkedin: profile.linkedin || undefined,
      github: profile.github || undefined,
      portfolio: profile.portfolio || undefined,
      bio: profile.bio || undefined,
      yearsOfExperience: profile.yearsOfExperience,
      completionPercentage: score,
      missingFields,
      education: profile.educations.map((e) => ({
        degree: e.degree,
        major: e.major || undefined,
        institution: e.institution,
        graduationYear: e.graduationYear || undefined,
        cgpa: e.cgpa || undefined,
        provenance: e.provenance as any,
      })),
      experience: profile.experiences.map((exp) => ({
        jobTitle: exp.jobTitle,
        company: exp.company,
        location: exp.location || undefined,
        responsibilities: JSON.parse(exp.responsibilities || '[]'),
        achievements: JSON.parse(exp.achievements || '[]'),
        technologies: JSON.parse(exp.technologies || '[]'),
        provenance: exp.provenance as any,
      })),
      skills: profile.skills.map((s) => ({
        name: s.name,
        category: s.category as any,
        provenance: s.provenance as any,
      })),
      projects: profile.projects.map((p) => ({
        name: p.name,
        description: p.description,
        tools: JSON.parse(p.tools || '[]'),
        outcome: p.outcome || undefined,
      })),
    };

    const masterLatex = LatexTemplateAgent.generateOverleafLatex(candidateProfile);

    return NextResponse.json({
      profile: {
        ...profile,
        completionPercentage: score,
        missingFields,
      },
      masterLatex,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      city,
      country,
      bio,
      currentStatus,
      education,
      experience,
      skills,
      projects,
      careerPreferences,
      rawCvText,
      originalFilename,
    } = body;

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email || 'user@example.com',
          name: fullName || 'User Candidate',
        },
      });
    }

    // Delete existing profile records if overwriting/confirming draft
    let profile = await prisma.userProfile.findFirst({ where: { userId: user.id } });
    if (profile) {
      await prisma.education.deleteMany({ where: { profileId: profile.id } });
      await prisma.experience.deleteMany({ where: { profileId: profile.id } });
      await prisma.skill.deleteMany({ where: { profileId: profile.id } });
      await prisma.project.deleteMany({ where: { profileId: profile.id } });
      await prisma.careerPreference.deleteMany({ where: { profileId: profile.id } });

      profile = await prisma.userProfile.update({
        where: { id: profile.id },
        data: {
          fullName: fullName || profile.fullName,
          email: email || profile.email,
          phone: phone || profile.phone,
          city: city || profile.city,
          country: country || profile.country,
          bio: bio || profile.bio,
          currentStatus: currentStatus || profile.currentStatus,
          yearsOfExperience: experience && experience.length > 0 ? 0.5 : 0,
        },
      });
    } else {
      profile = await prisma.userProfile.create({
        data: {
          userId: user.id,
          fullName: fullName || 'Candidate',
          email: email || 'user@example.com',
          phone: phone || '+880 1700-000000',
          city: city || 'Dhaka',
          country: country || 'Bangladesh',
          bio: bio || '',
          currentStatus: currentStatus || 'Job Seeking',
          yearsOfExperience: 0.5,
        },
      });
    }

    // Create Education
    if (education && Array.isArray(education)) {
      for (const edu of education) {
        await prisma.education.create({
          data: {
            profileId: profile.id,
            degree: edu.degree,
            major: edu.major || null,
            institution: edu.institution,
            graduationYear: edu.graduationYear ? Number(edu.graduationYear) : 2024,
            cgpa: edu.cgpa || null,
            provenance: edu.provenance || 'EXTRACTED',
          },
        });
      }
    }

    // Create Experience
    if (experience && Array.isArray(experience)) {
      for (const exp of experience) {
        await prisma.experience.create({
          data: {
            profileId: profile.id,
            jobTitle: exp.jobTitle,
            company: exp.company,
            location: exp.location || 'Dhaka',
            employmentType: exp.employmentType || 'Full-time',
            startDate: exp.startDate || '2024',
            endDate: exp.endDate || 'Present',
            isCurrent: exp.isCurrent ?? false,
            responsibilities: JSON.stringify(exp.responsibilities || []),
            achievements: JSON.stringify(exp.achievements || []),
            technologies: JSON.stringify(exp.technologies || []),
            provenance: exp.provenance || 'EXTRACTED',
          },
        });
      }
    }

    // Create Skills
    if (skills && Array.isArray(skills)) {
      for (const sk of skills) {
        await prisma.skill.create({
          data: {
            profileId: profile.id,
            name: typeof sk === 'string' ? sk : sk.name,
            category: sk.category || 'TECHNICAL',
            provenance: sk.provenance || 'EXTRACTED',
            confidence: sk.confidence || 0.95,
          },
        });
      }
    }

    // Create Projects
    if (projects && Array.isArray(projects)) {
      for (const p of projects) {
        await prisma.project.create({
          data: {
            profileId: profile.id,
            name: p.name,
            description: p.description || '',
            tools: JSON.stringify(p.tools || []),
            outcome: p.outcome || null,
          },
        });
      }
    }

    // Create Preferences
    if (careerPreferences) {
      await prisma.careerPreference.create({
        data: {
          profileId: profile.id,
          targetTitles: JSON.stringify(careerPreferences.targetTitles || []),
          targetIndustries: JSON.stringify(careerPreferences.targetIndustries || []),
          experienceLevel: careerPreferences.experienceLevel || 'Entry Level (0-1 yrs)',
          jobTypes: JSON.stringify(careerPreferences.jobTypes || ['Full-time']),
          locations: JSON.stringify(careerPreferences.locations || ['Dhaka']),
          remotePreference: careerPreferences.remotePreference || 'Flexible',
          minSalary: careerPreferences.minSalary ? Number(careerPreferences.minSalary) : 30000,
          currency: careerPreferences.currency || 'BDT',
          salaryNegotiable: careerPreferences.salaryNegotiable ?? true,
          preferredOrgTypes: JSON.stringify(careerPreferences.preferredOrgTypes || ['Private', 'Government']),
          naturalLanguageGoal: careerPreferences.naturalLanguageGoal || null,
        },
      });
    }

    // Store Master CV if provided
    if (rawCvText) {
      await prisma.masterCV.create({
        data: {
          profileId: profile.id,
          originalFilename: originalFilename || 'Uploaded_Resume.pdf',
          fileType: 'application/pdf',
          filePath: 'storage/cvs/uploaded.pdf',
          rawText: rawCvText,
          isDefault: true,
        },
      });
    }

    return NextResponse.json({ success: true, profileId: profile.id });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
