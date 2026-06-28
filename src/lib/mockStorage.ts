import { promises as fs } from 'fs';
import { join } from 'path';
import { computeReleaseStatus } from './utils';
import { RELEASE_STEPS } from './constants';
import type { IStorage } from './storage';
import type { Release } from '@/types';

const DATA_DIR = join(process.cwd(), '.data');
const RELEASES_FILE = join(DATA_DIR, 'releases.json');

interface StoredRelease {
  id: string;
  name: string;
  date: string;
  additionalInfo: string | null;
  steps: Array<{ stepIndex: number; completed: boolean }>;
  createdAt: string;
  updatedAt: string;
}

export class MockStorage implements IStorage {
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  private async readReleases(): Promise<StoredRelease[]> {
    await this.ensureDataDir();
    try {
      const data = await fs.readFile(RELEASES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async writeReleases(releases: StoredRelease[]): Promise<void> {
    await this.ensureDataDir();
    await fs.writeFile(RELEASES_FILE, JSON.stringify(releases, null, 2));
  }

  private formatRelease(data: StoredRelease): Release {
    return {
      id: data.id,
      name: data.name,
      date: data.date,
      additionalInfo: data.additionalInfo,
      status: computeReleaseStatus(data.steps),
      steps: data.steps,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async getReleases(): Promise<Release[]> {
    const releases = await this.readReleases();
    return releases
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((r) => this.formatRelease(r));
  }

  async getReleaseById(id: string): Promise<Release | null> {
    const releases = await this.readReleases();
    const release = releases.find((r) => r.id === id);
    return release ? this.formatRelease(release) : null;
  }

  async createRelease(data: {
    name: string;
    date: string;
    additionalInfo?: string;
  }): Promise<Release> {
    const releases = await this.readReleases();
    const id = `release_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newRelease: StoredRelease = {
      id,
      name: data.name,
      date: data.date,
      additionalInfo: data.additionalInfo || null,
      steps: RELEASE_STEPS.map((step) => ({
        stepIndex: step.index,
        completed: false,
      })),
      createdAt: now,
      updatedAt: now,
    };

    releases.push(newRelease);
    await this.writeReleases(releases);

    return this.formatRelease(newRelease);
  }

  async updateRelease(
    id: string,
    data: { additionalInfo?: string }
  ): Promise<Release | null> {
    const releases = await this.readReleases();
    const releaseIndex = releases.findIndex((r) => r.id === id);

    if (releaseIndex === -1) return null;

    releases[releaseIndex].additionalInfo = data.additionalInfo ?? releases[releaseIndex].additionalInfo;
    releases[releaseIndex].updatedAt = new Date().toISOString();

    await this.writeReleases(releases);
    return this.formatRelease(releases[releaseIndex]);
  }

  async deleteRelease(id: string): Promise<boolean> {
    const releases = await this.readReleases();
    const filtered = releases.filter((r) => r.id !== id);

    if (filtered.length === releases.length) return false;

    await this.writeReleases(filtered);
    return true;
  }

  async toggleStep(
    id: string,
    stepIndex: number,
    completed: boolean
  ): Promise<Release | null> {
    const releases = await this.readReleases();
    const release = releases.find((r) => r.id === id);

    if (!release) return null;

    const step = release.steps.find((s) => s.stepIndex === stepIndex);
    if (step) {
      step.completed = completed;
    }

    release.updatedAt = new Date().toISOString();
    await this.writeReleases(releases);

    return this.formatRelease(release);
  }
}
