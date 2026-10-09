import { AIProvider, AdventureContext, Mission, Adventure, AdventureReport } from '../ai-provider';

export class LocalGemmaProvider implements AIProvider {
  name = 'LocalGemma';
  private readonly ollamaUrl = 'http://localhost:11434/api/generate';

  async generateInitialMissions(context: AdventureContext): Promise<Mission[]> {
    const prompt = this.buildInitialPrompt(context);
    const response = await this.callOllama(prompt);
    return this.parseMissions(response);
  }

  async processObservation(observation: string, history: Mission[]): Promise<Mission> {
    const prompt = this.buildAdaptivePrompt(observation, history);
    const response = await this.callOllama(prompt);
    return this.parseSingleMission(response);
  }

  async generateAdventureReport(adventure: Adventure): Promise<AdventureReport> {
    const prompt = this.buildReportPrompt(adventure);
    const response = await this.callOllama(prompt);
    return this.parseReport(response);
  }

  private buildInitialPrompt(ctx: AdventureContext): string {
    return `You are the Outside.exe Game Master. Your goal is to create a procedurally generated real-world adventure that gets the user off their phone.
The user is in a ${ctx.environment} with ${ctx.energy} energy and a ${ctx.mood} mood.
They have ${ctx.timeLimit} minutes.

SAFETY RULES:
- NEVER suggest trespassing on private property.
- NEVER suggest entering restricted areas or dangerous roads.
- NEVER suggest climbing unsafe structures or approaching dangerous animals.
- NEVER suggest consuming unknown plants or mushrooms.
- All missions must be legal and safe.

MISSION DESIGN:
- Generate 3-5 physical missions.
- Focus on observation, movement, and sensory discovery.
- The missions should feel like a game, using evocative titles.
- Do NOT create a generic checklist; make it an experience.

Return ONLY a JSON array of objects with the following keys:
- title: short evocative name
- description: the physical task
- goal: what constitutes success
- xpReward: 10-50

Example:
[{"title": "The Silent Sentinel", "description": "Find a tree that looks like it has seen a hundred years of history.", "goal": "A large, old tree", "xpReward": 20}]`;
  }

  private buildAdaptivePrompt(obs: string, history: Mission[]): string {
    const lastMission = history[history.length - 1];
    return `You are the Outside.exe Game Master.
The user just completed the mission: "${lastMission.description}".
Their observation was: "${obs}".

Your task is to generate the NEXT adaptive mission.
Crucially, the mission must logically evolve from the user's observation.
If they found a red chair, don't just say "find something else". Instead, say "Find something that has been here longer than that red chair".

SAFETY RULES:
- Ensure the evolved mission is safe and legal.

Return ONLY a JSON object with:
- title: short evocative name
- description: the physical task
- goal: what constitutes success
- xpReward: 10-50`;
  }

  private buildReportPrompt(adventure: Adventure): string {
    return `You are the Outside.exe Game Master. Generate a poetic final adventure report.
Environment: ${adventure.context.environment}
Missions completed: ${adventure.missions.map(m => m.description).join(', ')}
Observations: ${adventure.missions.map(m => m.observation).filter(Boolean).join('; ')}

Return ONLY a JSON object with:
- summary: a narrative summary of the journey, treating the user as a hero
- discoveries: a list of the most interesting things found
- finalReflection: a short, philosophical reflection on the act of observing the real world
- totalXP: ${adventure.totalXP}
- timeSpent: ${adventure.context.timeLimit}`;
  }

  private async callOllama(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.ollamaUrl, {
        method: 'POST',
        body: JSON.stringify({
          model: 'gemma',
          prompt: prompt,
          stream: false,
          format: 'json'
        }),
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Ollama error:', error);
      throw new Error('Local AI server (Ollama) is not responding. Please ensure it is running.');
    }
  }

  private parseMissions(json: string): Mission[] {
    const data = JSON.parse(json);
    return data.map((m: any, i: number) => ({
      ...m,
      id: `mission-${Date.now()}-${i}`,
      isCompleted: false,
    }));
  }

  private parseSingleMission(json: string): Mission {
    const m = JSON.parse(json);
    return {
      ...m,
      id: `mission-${Date.now()}`,
      isCompleted: false,
    };
  }

  private parseReport(json: string): AdventureReport {
    return JSON.parse(json);
  }
}
