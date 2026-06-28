import { getStorage } from '@/lib/storage';
import { RELEASE_STEPS } from '@/lib/constants';
import { NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
    stepIndex: string;
  };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = (await request.json()) as { completed: boolean };
    const stepIndex = parseInt(params.stepIndex, 10);

    if (isNaN(stepIndex) || stepIndex < 0 || stepIndex >= RELEASE_STEPS.length) {
      return NextResponse.json({ error: 'Invalid step index' }, { status: 400 });
    }

    const storage = await getStorage();
    const release = await storage.toggleStep(params.id, stepIndex, body.completed);

    if (!release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    return NextResponse.json(release);
  } catch (error) {
    console.error('Failed to update step:', error);
    return NextResponse.json({ error: 'Failed to update step' }, { status: 500 });
  }
}
