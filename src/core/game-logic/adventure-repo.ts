import { db } from '@/lib/db';
import { Adventure, Mission } from '@/core/ai/ai-provider';

export const AdventureRepo = {
  create: async (adventure: Omit<Adventure, 'startTime' | 'missions'>) => {
    try {
      await db.query(
        'INSERT INTO adventures (id, context, status, totalXP) VALUES ($1, $2, $3, $4)',
        [String(adventure.id), JSON.stringify(adventure.context), String(adventure.status), Number(adventure.totalXP || 0)]
      );
    } catch (e) {
      console.error('Repo create error:', e);
      throw e;
    }
  },

  getById: async (id: string): Promise<Adventure | null> => {
    try {
      const advRes = await db.query('SELECT * FROM adventures WHERE id = $1', [String(id)]);
      const adventure = advRes.rows[0];
      if (!adventure) return null;

      const missRes = await db.query('SELECT * FROM missions WHERE adventureId = $1', [String(id)]);
      const missions = missRes.rows;

      return {
        id: adventure.id,
        startTime: new Date(adventure.startTime),
        context: adventure.context,
        status: adventure.status,
        totalXP: adventure.totalXP,
        missions: missions.map((m: any) => ({
          ...m,
          isCompleted: !!m.iscompleted,
        })),
      };
    } catch (e) {
      console.error('Repo getById error:', e);
      return null;
    }
  },

  updateStatus: async (id: string, status: string, totalXP: number) => {
    try {
      await db.query('UPDATE adventures SET status = $1, totalXP = $2 WHERE id = $3', [String(status), Number(totalXP), String(id)]);
    } catch (e) {
      console.error('Repo updateStatus error:', e);
      throw e;
    }
  },

  saveMission: async (mission: Mission, adventureId: string) => {
    try {
      const checkRes = await db.query('SELECT 1 FROM missions WHERE id = $1', [String(mission.id)]);

      if (checkRes.rowCount && checkRes.rowCount > 0) {
        await db.query(
          'UPDATE missions SET isCompleted = $1, observation = $2 WHERE id = $3',
          [mission.isCompleted ? true : false, mission.observation || null, String(mission.id)]
        );
      } else {
        await db.query(
          `INSERT INTO missions (id, adventureId, title, description, goal, xpReward, isCompleted, observation)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            String(mission.id),
            String(adventureId),
            String(mission.title),
            String(mission.description),
            String(mission.goal),
            Number(mission.xpReward),
            mission.isCompleted ? true : false,
            mission.observation || null,
          ]
        );
      }
    } catch (e) {
      console.error('Repo saveMission error:', e);
      throw e;
    }
  }
};
