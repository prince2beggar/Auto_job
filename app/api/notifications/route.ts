import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NotificationAgent } from '@/lib/agents/notification-agent';
import { NormalizedJob, MatchAssessment } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      include: {
        profile: true,
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ notifications: [], digest: null });
    }

    const jobs = await prisma.job.findMany({
      where: { status: 'ACTIVE' },
      include: {
        matches: user.profile ? { where: { profileId: user.profile.id } } : false,
      },
    });

    const matchesMap = new Map<string, MatchAssessment>();
    const normalizedJobs: NormalizedJob[] = jobs.map((job) => {
      const match = job.matches[0];
      if (match) {
        matchesMap.set(job.id, {
          overallScore: match.overallScore,
          educationScore: match.educationScore,
          experienceScore: match.experienceScore,
          skillsScore: match.skillsScore,
          roleScore: match.roleScore,
          locationScore: match.locationScore,
          eligibilityStatus: match.eligibilityStatus as any,
          eligibilityExplanation: match.eligibilityExplanation,
          matchReasons: JSON.parse(match.matchReasons || '[]'),
          gaps: JSON.parse(match.gaps || '[]'),
          urgencyLevel: match.urgencyLevel as any,
        });
      }

      return {
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
        postedDate: job.postedDate.toISOString(),
        status: job.status as any,
      };
    });

    const digest = NotificationAgent.generateDailyDigest(normalizedJobs, matchesMap);

    return NextResponse.json({
      notifications: user.notifications,
      digest,
    });
  } catch (error) {
    console.error('Error in notifications route:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { notificationId } = await req.json();
    if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    } else {
      await prisma.notification.updateMany({
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
