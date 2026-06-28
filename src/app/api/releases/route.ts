import { getStorage } from '@/lib/storage';
import type { CreateReleaseInput } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const storage = await getStorage();
    const releases = await storage.getReleases();
    return NextResponse.json(releases);
  } catch (error) {
    console.error('Failed to fetch releases:', error);
    return NextResponse.json({ error: 'Failed to fetch releases' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateReleaseInput;

    if (!body.name || !body.date) {
      return NextResponse.json(
        { error: 'Name and date are required' },
        { status: 400 }
      );
    }

    const storage = await getStorage();
    const release = await storage.createRelease(body);

    return NextResponse.json(release, { status: 201 });
  } catch (error) {
    console.error('Failed to create release:', error);
    return NextResponse.json({ error: 'Failed to create release' }, { status: 500 });
  }
}
