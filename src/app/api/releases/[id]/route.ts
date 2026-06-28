import { getStorage } from '@/lib/storage';
import type { UpdateReleaseInput } from '@/types';
import { NextResponse } from 'next/server';

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, props: Params) {
  try {
    const params = await props.params;
    const storage = await getStorage();
    const release = await storage.getReleaseById(params.id);

    if (!release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    return NextResponse.json(release);
  } catch (error) {
    console.error('Failed to fetch release:', error);
    return NextResponse.json({ error: 'Failed to fetch release' }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: Params) {
  try {
    const params = await props.params;
    const body = (await request.json()) as UpdateReleaseInput;
    const storage = await getStorage();
    const release = await storage.updateRelease(params.id, body);

    if (!release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    return NextResponse.json(release);
  } catch (error) {
    console.error('Failed to update release:', error);
    return NextResponse.json({ error: 'Failed to update release' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: Params) {
  try {
    const params = await props.params;
    const storage = await getStorage();
    const success = await storage.deleteRelease(params.id);

    if (!success) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete release:', error);
    return NextResponse.json({ error: 'Failed to delete release' }, { status: 500 });
  }
}
