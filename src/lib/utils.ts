import { RELEASE_STEPS, RELEASE_STATUS, type ReleaseStatus } from './constants';

export function computeReleaseStatus(steps: Array<{ completed: boolean }>): ReleaseStatus {
  const completedCount = steps.filter((s) => s.completed).length;
  const totalSteps = RELEASE_STEPS.length;

  if (completedCount === 0) return RELEASE_STATUS.PLANNED;
  if (completedCount === totalSteps) return RELEASE_STATUS.DONE;
  return RELEASE_STATUS.ONGOING;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
