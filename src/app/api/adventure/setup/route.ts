import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/core/ai/provider-factory';
import { AdventureRepo } from '@/core/game-logic/adventure-repo';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context, mode = 'demo' } = body;
    const provider = getAIProvider(mode as any);

    const missions = await provider.generateInitialMissions(context);
    const adventureId = uuidv4();

    await AdventureRepo.create({
      id: adventureId,
      context,
      status: 'ACTIVE',
      totalXP: 0,
    });

    for (const m of missions) {
      await AdventureRepo.saveMission(m, adventureId);
    }

    return NextResponse.json({ adventureId, missions });
  } catch (error: any) {
    console.error('Setup Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
