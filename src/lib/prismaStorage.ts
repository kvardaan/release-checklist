import { prisma } from './db';
import { computeReleaseStatus } from './utils';
import { RELEASE_STEPS } from './constants';
import type { IStorage } from './storage';
import type { Release } from '@/types';

export class PrismaStorage implements IStorage {
  private formatRelease(data: any): Release {
    const steps = RELEASE_STEPS.map((step) => {
      const completed = data.steps.find((s: any) => s.stepIndex === step.index)?.completed || false;
      return {
        stepIndex: step.index,
        completed,
      };
    });

    return {
      id: data.id,
      name: data.name,
      date: data.date.toISOString(),
      additionalInfo: data.additionalInfo,
      status: computeReleaseStatus(steps),
      steps,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };
  }

  async getReleases(): Promise<Release[]> {
    const releases = await prisma.release.findMany({
      include: { steps: true },
      orderBy: { date: 'desc' },
    });

    return releases.map((r) => this.formatRelease(r));
  }

  async getReleaseById(id: string): Promise<Release | null> {
    const release = await prisma.release.findUnique({
      where: { id },
      include: { steps: true },
    });

    return release ? this.formatRelease(release) : null;
  }

  async createRelease(data: {
    name: string;
    date: string;
    additionalInfo?: string;
  }): Promise<Release> {
    const release = await prisma.release.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        additionalInfo: data.additionalInfo || null,
        steps: {
          create: RELEASE_STEPS.map((step) => ({
            stepIndex: step.index,
            completed: false,
          })),
        },
      },
      include: { steps: true },
    });

    return this.formatRelease(release);
  }

  async updateRelease(
    id: string,
    data: { additionalInfo?: string }
  ): Promise<Release | null> {
    try {
      const release = await prisma.release.update({
        where: { id },
        data: { additionalInfo: data.additionalInfo },
        include: { steps: true },
      });

      return this.formatRelease(release);
    } catch {
      return null;
    }
  }

  async deleteRelease(id: string): Promise<boolean> {
    try {
      await prisma.release.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async toggleStep(
    id: string,
    stepIndex: number,
    completed: boolean
  ): Promise<Release | null> {
    try {
      await prisma.releaseStep.update({
        where: {
          releaseId_stepIndex: { releaseId: id, stepIndex },
        },
        data: { completed },
      });

      return this.getReleaseById(id);
    } catch {
      return null;
    }
  }
}
