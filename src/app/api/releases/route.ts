import { prisma } from '@/lib/db';
import { computeReleaseStatus } from '@/lib/utils';
import { RELEASE_STEPS } from '@/lib/constants';
import type { CreateReleaseInput } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const releases = await prisma.release.findMany({
      include: {
        steps: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const formattedReleases = releases.map((release) => {
      const steps = RELEASE_STEPS.map((step) => {
        const completed = release.steps.find((s) => s.stepIndex === step.index)?.completed || false;
        return {
          stepIndex: step.index,
          completed,
        };
      });

      return {
        id: release.id,
        name: release.name,
        date: release.date.toISOString(),
        additionalInfo: release.additionalInfo,
        status: computeReleaseStatus(steps),
        steps,
        createdAt: release.createdAt.toISOString(),
        updatedAt: release.updatedAt.toISOString(),
      };
    });

    return NextResponse.json(formattedReleases);
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

    const release = await prisma.release.create({
      data: {
        name: body.name,
        date: new Date(body.date),
        additionalInfo: body.additionalInfo || null,
        steps: {
          create: RELEASE_STEPS.map((step) => ({
            stepIndex: step.index,
            completed: false,
          })),
        },
      },
      include: {
        steps: true,
      },
    });

    const steps = RELEASE_STEPS.map((step) => {
      const completed = release.steps.find((s) => s.stepIndex === step.index)?.completed || false;
      return {
        stepIndex: step.index,
        completed,
      };
    });

    return NextResponse.json(
      {
        id: release.id,
        name: release.name,
        date: release.date.toISOString(),
        additionalInfo: release.additionalInfo,
        status: computeReleaseStatus(steps),
        steps,
        createdAt: release.createdAt.toISOString(),
        updatedAt: release.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create release:', error);
    return NextResponse.json({ error: 'Failed to create release' }, { status: 500 });
  }
}
