import { NormalizedJob, MatchAssessment } from '../types';

export interface DailyDigest {
  totalJobsFound: number;
  highlyMatchedCount: number;
  governmentJobsCount: number;
  deadlinesWithin48Hours: number;
  topRecommendation?: {
    title: string;
    company: string;
    matchScore: number;
    deadline: string;
    jobId: string;
  };
}

export class NotificationAgent {
  /**
   * Generates a concise daily job digest based on discovered opportunities and matches.
   */
  static generateDailyDigest(
    jobs: NormalizedJob[],
    matches: Map<string, MatchAssessment>
  ): DailyDigest {
    const now = new Date().getTime();
    let highlyMatchedCount = 0;
    let governmentJobsCount = 0;
    let deadlinesWithin48Hours = 0;
    let topRec: DailyDigest['topRecommendation'] = undefined;
    let highestScore = -1;

    for (const job of jobs) {
      if (job.jobType === 'GOVERNMENT') governmentJobsCount++;

      const deadline = new Date(job.applicationDeadline).getTime();
      const diffHours = (deadline - now) / (1000 * 3600);
      if (diffHours > 0 && diffHours <= 48) {
        deadlinesWithin48Hours++;
      }

      const match = matches.get(job.id);
      if (match) {
        if (match.overallScore >= 85) highlyMatchedCount++;
        if (match.overallScore > highestScore) {
          highestScore = match.overallScore;
          topRec = {
            title: job.title,
            company: job.company,
            matchScore: match.overallScore,
            deadline: job.applicationDeadline,
            jobId: job.id,
          };
        }
      }
    }

    return {
      totalJobsFound: jobs.length,
      highlyMatchedCount,
      governmentJobsCount,
      deadlinesWithin48Hours,
      topRecommendation: topRec,
    };
  }
}
