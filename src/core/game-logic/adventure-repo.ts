import db from '@/lib/db';
import { Adventure, Mission } from '@/core/ai/ai-provider';

export const AdventureRepo = {
  create: (adventure: Omit<Adventure, 'startTime' | 'missions'>) => {
    try {
      const stmt = db.prepare('INSERT INTO adventures (id, context, status, totalXP) VALUES (?, ?, ?, ?)');
      stmt.run(
        String(adventure.id),
        JSON.stringify(adventure.context),
        String(adventure.status),
        Number(adventure.totalXP || 0)
      );
    } catch (e) {
      console.error('Repo create error:', e);
      throw e;
    }
  },

  getById: (id: string): Adventure | null => {
    try {
      const adventure = db.prepare('SELECT * FROM adventures WHERE id = ?').get(String(id)) as any;
      if (!adventure) return null;

      const missions = db.prepare('SELECT * FROM missions WHERE adventureId = ?').all(String(id)) as any[];

      return {
        id: adventure.id,
        startTime: new Date(adventure.startTime),
        context: JSON.parse(adventure.context),
        status: adventure.status,
        totalXP: adventure.totalXP,
        missions: missions.map(m => ({
          ...m,
          isCompleted: !!m.isCompleted,
        })),
      };
    } catch (e) {
      console.error('Repo getById error:', e);
      return null;
    }
  },

  updateStatus: (id: string, status: string, totalXP: number) => {
    try {
      const stmt = db.prepare('UPDATE adventures SET status = ?, totalXP = ? WHERE id = ?');
      stmt.run(String(status), Number(totalXP), String(id));
    } catch (e) {
      console.error('Repo updateStatus error:', e);
      throw e;
    }
  },

  saveMission: (mission: Mission, adventureId: string) => {
    try {
      // Use a transaction to ensure atomic write
      const transaction = db.transaction(() => {
        const exists = db.prepare('SELECT 1 FROM missions WHERE id = ?').get(String(mission.id));

        if (exists) {
          const stmt = db.prepare('UPDATE missions SET isCompleted = ?, observation = ? WHERE id = ?');
          stmt.run(
            mission.isCompleted ? 1 : 0,
            mission.observation || null,
            String(mission.id)
          );
        } else {
          const stmt = db.prepare(`
            INSERT INTO missions (id, adventureId, title, description, goal, xpReward, isCompleted, observation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `);
          stmt.run(
            String(mission.id),
            String(adventureId),
            String(mission.title),
            String(mission.description),
            String(mission.goal),
            Number(mission.xpReward),
            mission.isCompleted ? 1 : 0,
            mission.observation || null
          );
        }
      });

      transaction();
    } catch (e) {
      console.error('Repo saveMission error:', e);
      throw e;
    }
  }
};
