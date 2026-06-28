import { prisma } from '@/lib/db';
import { computeReleaseStatus } from '@/lib/utils';
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

    const step = await prisma.releaseStep.update({
      where: {
        releaseId_stepIndex: {
          releaseId: params.id,
          stepIndex,
        },
      },
      data: {
        completed: body.completed,
      },
    });

    const release = await prisma.release.findUnique({
      where: { id: params.id },
      include: { steps: true },
    });

    if (!release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    const steps = RELEASE_STEPS.map((s) => {
      const completed = release.steps.find((rs) => rs.stepIndex === s.index)?.completed || false;
      return {
        stepIndex: s.index,
        completed,
      };
    });

    return NextResponse.json({
      id: release.id,
      name: release.name,
      date: release.date.toISOString(),
      additionalInfo: release.additionalInfo,
      status: computeReleaseStatus(steps),
      steps,
      createdAt: release.createdAt.toISOString(),
      updatedAt: release.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Failed to update step:', error);
    return NextResponse.json({ error: 'Failed to update step' }, { status: 500 });
  }
}
