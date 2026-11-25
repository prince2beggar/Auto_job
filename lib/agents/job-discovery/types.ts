import { NormalizedJob } from '../../types';

export interface JobConnector {
  sourceId: string;
  sourceName: string;
  country: string;
  fetchJobs(): Promise<NormalizedJob[]>;
}
