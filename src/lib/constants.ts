export const RELEASE_STEPS = [
  {
    index: 0,
    name: 'Planning & Requirements',
    description: 'Define scope and requirements',
  },
  {
    index: 1,
    name: 'Code Review',
    description: 'Review code changes',
  },
  {
    index: 2,
    name: 'Testing',
    description: 'Execute test suite',
  },
  {
    index: 3,
    name: 'Documentation',
    description: 'Update docs and changelog',
  },
  {
    index: 4,
    name: 'Security Audit',
    description: 'Security review',
  },
  {
    index: 5,
    name: 'Performance Testing',
    description: 'Performance benchmarks',
  },
  {
    index: 6,
    name: 'Staging Deployment',
    description: 'Deploy to staging',
  },
  {
    index: 7,
    name: 'User Acceptance Testing',
    description: 'UAT testing',
  },
  {
    index: 8,
    name: 'Production Deployment',
    description: 'Deploy to production',
  },
  {
    index: 9,
    name: 'Monitoring & Rollout',
    description: 'Monitor and complete rollout',
  },
] as const;

export const RELEASE_STATUS = {
  PLANNED: 'planned',
  ONGOING: 'ongoing',
  DONE: 'done',
} as const;

export type ReleaseStatus = (typeof RELEASE_STATUS)[keyof typeof RELEASE_STATUS];
