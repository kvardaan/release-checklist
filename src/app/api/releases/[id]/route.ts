import { prisma } from '@/lib/db';
import { computeReleaseStatus } from '@/lib/utils';
import { RELEASE_STEPS } from '@/lib/constants';
import type { UpdateReleaseInput } from '@/types';
import { NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const release = await prisma.release.findUnique({
      where: { id: params.id },
      include: { steps: true },
    });

    if (!release) {
      return NextResponse.json({ error: 'Release not found' }, { status: 404 });
    }

    const steps = RELEASE_STEPS.map((step) => {
      const completed = release.steps.find((s) => s.stepIndex === step.index)?.completed || false;
      return {
        stepIndex: step.index,
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
    console.error('Failed to fetch release:', error);
    return NextResponse.json({ error: 'Failed to fetch release' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = (await request.json()) as UpdateReleaseInput;

    const release = await prisma.release.update({
      where: { id: params.id },
      data: {
        additionalInfo: body.additionalInfo,
      },
      include: { steps: true },
    });

    const steps = RELEASE_STEPS.map((step) => {
      const completed = release.steps.find((s) => s.stepIndex === step.index)?.completed || false;
      return {
        stepIndex: step.index,
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
    console.error('Failed to update release:', error);
    return NextResponse.json({ error: 'Failed to update release' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await prisma.release.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete release:', error);
    return NextResponse.json({ error: 'Failed to delete release' }, { status: 500 });
  }
}
