import type { Release } from '@/types';

export interface IStorage {
  getReleases(): Promise<Release[]>;
  getReleaseById(id: string): Promise<Release | null>;
  createRelease(data: {
    name: string;
    date: string;
    additionalInfo?: string;
  }): Promise<Release>;
  updateRelease(
    id: string,
    data: { additionalInfo?: string }
  ): Promise<Release | null>;
  deleteRelease(id: string): Promise<boolean>;
  toggleStep(id: string, stepIndex: number, completed: boolean): Promise<Release | null>;
}

let storageInstance: IStorage | null = null;

export async function getStorage(): Promise<IStorage> {
  if (storageInstance) {
    return storageInstance;
  }

  if (process.env.MOCK === 'true') {
    const { MockStorage } = await import('./mockStorage');
    storageInstance = new MockStorage();
  } else {
    const { PrismaStorage } = await import('./prismaStorage');
    storageInstance = new PrismaStorage();
  }

  return storageInstance;
}
