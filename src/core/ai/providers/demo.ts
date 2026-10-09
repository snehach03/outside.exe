import { AIProvider, AdventureContext, Mission, Adventure, AdventureReport } from '../ai-provider';

export class DemoProvider implements AIProvider {
  name = 'DemoMode';

  async generateInitialMissions(context: AdventureContext): Promise<Mission[]> {
    return [
      {
        id: 'demo-1',
        title: 'The Urban Whisper',
        description: 'Find something that is moving, something making a sound, and something that looks out of place.',
        goal: '3 distinct observations',
        xpReward: 20,
        isCompleted: false,
      },
      {
        id: 'demo-2',
        title: 'Time Traveler',
        description: 'Find an object that looks like it has been here for at least 10 years.',
        goal: 'Old object',
        xpReward: 15,
        isCompleted: false,
      },
      {
        id: 'demo-3',
        title: 'Color Hunt',
        description: 'Find three different things that are the exact same shade of red.',
        goal: '3 red objects',
        xpReward: 25,
        isCompleted: false,
      },
    ];
  }

  async processObservation(observation: string, history: Mission[]): Promise<Mission> {
    return {
      id: `demo-adaptive-${Date.now()}`,
      title: 'The Echo',
      description: `You noticed "${observation}". Now find something that is the complete opposite of that.`,
      goal: 'Opposite object',
      xpReward: 30,
      isCompleted: false,
    };
  }

  async generateAdventureReport(adventure: Adventure): Promise<AdventureReport> {
    return {
      summary: 'A wonderful demo adventure exploring the boundaries of your immediate surroundings.',
      discoveries: ['A hidden pattern in the pavement', 'The sound of distant traffic', 'A stubborn weed'],
      finalReflection: 'Even in the most familiar places, there is always something new to discover if you look closely enough.',
      totalXP: adventure.totalXP,
      timeSpent: 30,
    };
  }
}
