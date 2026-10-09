import { AIProvider } from './ai-provider';
import { LocalGemmaProvider } from './providers/local-gemma';
import { DemoProvider } from './providers/demo';

export function getAIProvider(mode: 'local' | 'demo' | 'openai' = 'local'): AIProvider {
  switch (mode) {
    case 'local':
      return new LocalGemmaProvider();
    case 'demo':
      return new DemoProvider();
    case 'openai':
      // OpenAIProvider would be implemented here similarly to LocalGemmaProvider
      throw new Error('OpenAIProvider not yet implemented');
    default:
      return new DemoProvider();
  }
}
