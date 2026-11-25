import { NormalizedJob, UrgencyLevel } from '../../types';
import { BdjobsConnector } from './bdjobs-connector';
import { LinkedInConnector } from './linkedin-connector';
import { GovernmentCircularConnector } from './government-connector';
import { InternshipTraineeConnector } from './internship-connector';

export class JobNormalizer {
  /**
   * Calculates deadline urgency category based on current time.
   */
  static getUrgency(deadlineIso: string): UrgencyLevel {
    const now = new Date().getTime();
    const deadline = new Date(deadlineIso).getTime();
    const diffMs = deadline - now;

    if (diffMs <= 0) return 'EXPIRED';
    const diffHours = diffMs / (1000 * 3600);

    if (diffHours <= 24) return 'URGENT';
    if (diffHours <= 72) return 'HIGH'; // 2-3 days
    if (diffHours <= 168) return 'MEDIUM'; // 4-7 days
    return 'NORMAL';
  }

  /**
   * Detects and merges duplicate listings across disparate connectors.
   * e.g. same company + title + location posted on both LinkedIn and Bdjobs.
   */
  static deduplicateJobs(jobs: NormalizedJob[]): NormalizedJob[] {
    const seen = new Map<string, NormalizedJob>();

    for (const job of jobs) {
      const cleanTitle = job.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanCompany = job.company.toLowerCase().replace(/[^a-z0-9]/g, '');
      const key = `${cleanCompany}-${cleanTitle}`;

      if (!seen.has(key)) {
        seen.set(key, job);
      } else {
        // If duplicate found, preserve the one with richest data or prefer primary portal
        const existing = seen.get(key)!;
        if (!existing.recruiterEmail && job.recruiterEmail) {
          existing.recruiterEmail = job.recruiterEmail;
        }
        if (!existing.salary && job.salary) {
          existing.salary = job.salary;
        }
      }
    }

    return Array.from(seen.values());
  }

  /**
   * Fetches, normalizes, and deduplicates from all active connectors.
   */
  static async discoverAllJobs(): Promise<NormalizedJob[]> {
    const connectors = [
      new BdjobsConnector(),
      new LinkedInConnector(),
      new GovernmentCircularConnector(),
      new InternshipTraineeConnector(),
    ];

    const results = await Promise.allSettled(connectors.map((c) => c.fetchJobs()));
    const allJobs: NormalizedJob[] = [];

    for (const res of results) {
      if (res.status === 'fulfilled') {
        allJobs.push(...res.value);
      } else {
        console.error('Connector failed:', res.reason);
      }
    }

    const deduplicated = this.deduplicateJobs(allJobs);

    // Update active vs expired status
    for (const job of deduplicated) {
      const urgency = this.getUrgency(job.applicationDeadline);
      if (urgency === 'EXPIRED') {
        job.status = 'EXPIRED';
      }
    }

    return deduplicated;
  }
}
