import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/core/ai/provider-factory';
import { AdventureRepo } from '@/core/game-logic/adventure-repo';

class AIRequestQueue {
  private queue: (() => Promise<void>)[] = [];
  private activeRequests = 0;
  private readonly MAX_CONCURRENT = 1; // Sequential processing for local LLM stability

  async add<T>(fn: () => Promise<T>): Promise<T> {
    if (this.activeRequests >= this.MAX_CONCURRENT) {
      await new Promise<void>((resolve) => {
        this.queue.push(async () => {
          resolve();
        });
      });
    }

    this.activeRequests++;
    try {
      return await fn();
    } finally {
      this.activeRequests--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) next();
      }
    }
  }
}

const queue = new AIRequestQueue();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adventureId, observation, missionId, mode = 'demo' } = body;

    if (!adventureId || !observation || !missionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await queue.add(async () => {
      const provider = getAIProvider(mode as any);
      const adventure = AdventureRepo.getById(adventureId);
      if (!adventure) throw new Error(`Adventure ${adventureId} not found`);

      const mission = adventure.missions.find(m => m.id === missionId);
      if (!mission) throw new Error(`Mission ${missionId} not found`);

      // 1. Update mission
      const updatedMission = { ...mission, isCompleted: true, observation };
      AdventureRepo.saveMission(updatedMission, adventureId);

      // 2. AI Generation
      const nextMission = await provider.processObservation(observation, adventure.missions);

      // 3. Save new mission
      AdventureRepo.saveMission(nextMission, adventureId);

      // 4. Update XP
      const newTotalXP = adventure.totalXP + nextMission.xpReward;
      AdventureRepo.updateStatus(adventureId, adventure.status, newTotalXP);

      return nextMission;
    });

    return NextResponse.json({ nextMission: result });
  } catch (error: any) {
    console.error('[CHECK-IN ERROR]:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
