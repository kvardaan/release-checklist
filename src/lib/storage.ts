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
    console.log("Using MOCK Data Store")
    const { MockStorage } = await import('./mockStorage');
    storageInstance = new MockStorage();
  } else {
    console.log("Using REAL DB")
    const { PrismaStorage } = await import('./prismaStorage');
    storageInstance = new PrismaStorage();
  }

  return storageInstance;
}
