import { RELEASE_STATUS } from '@/lib/constants';

export type ReleaseStatus = (typeof RELEASE_STATUS)[keyof typeof RELEASE_STATUS];

export interface ReleaseStep {
  stepIndex: number;
  completed: boolean;
}

export interface Release {
  id: string;
  name: string;
  date: string;
  additionalInfo: string | null;
  status: ReleaseStatus;
  steps: ReleaseStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReleaseInput {
  name: string;
  date: string;
  additionalInfo?: string;
}

export interface UpdateReleaseInput {
  additionalInfo?: string;
}
