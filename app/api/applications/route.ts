import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const profile = await prisma.userProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ applications: [] });
    }

    const applications = await prisma.application.findMany({
      where: { profileId: profile.id },
      include: {
        job: {
          include: {
            governmentCircular: true,
            matches: { where: { profileId: profile.id } },
          },
        },
        cvVersion: true,
        events: {
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const enriched = applications.map((app) => ({
      id: app.id,
      status: app.status,
      applicationMethod: app.applicationMethod,
      appliedDate: app.appliedDate ? app.appliedDate.toISOString() : null,
      notes: app.notes,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      job: {
        id: app.job.id,
        title: app.job.title,
        company: app.job.company,
        jobType: app.job.jobType,
        location: app.job.location,
        salary: app.job.salary,
        applicationDeadline: app.job.applicationDeadline.toISOString(),
        applicationMethod: app.job.applicationMethod,
        applicationUrl: app.job.applicationUrl,
        recruiterEmail: app.job.recruiterEmail,
        matchScore: app.job.matches[0]?.overallScore || 80,
      },
      events: app.events.map((e) => ({
        id: e.id,
        eventType: e.eventType,
        title: e.title,
        description: e.description,
        timestamp: e.timestamp.toISOString(),
      })),
    }));

    return NextResponse.json({ applications: enriched });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { jobId, status, notes, eventTitle, eventDescription } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    const profile = await prisma.userProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const appStatus = status || 'SAVED';

    let application = await prisma.application.findUnique({
      where: {
        profileId_jobId: {
          profileId: profile.id,
          jobId,
        },
      },
    });

    if (!application) {
      application = await prisma.application.create({
        data: {
          profileId: profile.id,
          jobId,
          status: appStatus,
          applicationMethod: job.applicationMethod,
          notes: notes || `Application initiated for ${job.title} at ${job.company}`,
          appliedDate: appStatus === 'APPLIED' ? new Date() : null,
        },
      });

      await prisma.applicationEvent.create({
        data: {
          applicationId: application.id,
          eventType: 'INITIATED',
          title: eventTitle || `Job ${appStatus === 'SAVED' ? 'Saved' : 'Application Started'}`,
          description:
            eventDescription || `Job marked as ${appStatus} for ${job.company}.`,
        },
      });
    } else {
      application = await prisma.application.update({
        where: { id: application.id },
        data: {
          status: appStatus,
          notes: notes !== undefined ? notes : application.notes,
          appliedDate: appStatus === 'APPLIED' ? new Date() : application.appliedDate,
        },
      });

      await prisma.applicationEvent.create({
        data: {
          applicationId: application.id,
          eventType: 'STATUS_CHANGE',
          title: eventTitle || `Status updated to ${appStatus.replace(/_/g, ' ')}`,
          description:
            eventDescription ||
            `Candidate transitioned application stage to ${appStatus.replace(/_/g, ' ')}.`,
        },
      });
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Error creating/updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
