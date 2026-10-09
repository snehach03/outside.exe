export interface AIProvider {
  name: string;
  generateInitialMissions(context: AdventureContext): Promise<Mission[]>;
  processObservation(observation: string, history: Mission[]): Promise<Mission>;
  generateAdventureReport(adventure: Adventure): Promise<AdventureReport>;
}

export interface AdventureContext {
  timeLimit: number; // in minutes
  energy: 'Low' | 'Medium' | 'High';
  mood: 'Curious' | 'Adventurous' | 'Calm' | 'Social';
  groupSize: 'Solo' | 'Group';
  environment: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  goal: string;
  xpReward: number;
  isCompleted: boolean;
  observation?: string;
}

export interface Adventure {
  id: string;
  startTime: Date;
  context: AdventureContext;
  missions: Mission[];
  status: 'SETUP' | 'ACTIVE' | 'COMPLETED';
  totalXP: number;
}

export interface AdventureReport {
  summary: string;
  discoveries: string[];
  finalReflection: string;
  totalXP: number;
  timeSpent: number;
}
