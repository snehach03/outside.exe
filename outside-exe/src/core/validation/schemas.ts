import { z } from 'zod';

export const AdventureContextSchema = z.object({
  timeLimit: z.number().min(15).max(120),
  energy: z.enum(['Low', 'Medium', 'High']),
  mood: z.enum(['Curious', 'Adventurous', 'Calm', 'Social']),
  groupSize: z.enum(['Solo', 'Group']),
  environment: z.string().min(2),
});

export const MissionSchema = z.object({
  title: z.string(),
  description: z.string(),
  goal: z.string(),
  xpReward: z.number().int().min(0),
});

export const AdventureReportSchema = z.object({
  summary: z.string(),
  discoveries: z.array(z.string()),
  finalReflection: z.string(),
  totalXP: z.number(),
  timeSpent: z.number(),
});

export type AdventureContext = z.infer<typeof AdventureContextSchema>;
export type MissionData = z.infer<typeof MissionSchema>;
export type AdventureReportData = z.infer<typeof AdventureReportSchema>;
