import { GenerationConfig, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SafetySetting } from '@google/generative-ai';
import { Configuration } from '@service/infrastructure/configuration';
import { Service } from 'typedi';
import { Logger } from '@service/infrastructure/logger';
import { LLMPrompt } from '@service/domain/llm-prompts/llm-prompts';

@Service()
class LLMGenerator {
  private static readonly logger = new Logger('llm-generator');

  private ai: GoogleGenerativeAI;

  constructor(private configuration: Configuration) {
    this.ai = new GoogleGenerativeAI(this.configuration.GEMINI_TOKEN);
  }

  async generateTextForPrompt(prompt: LLMPrompt): Promise<string | null> {
    const generationConfig: GenerationConfig = {};

    if (prompt.temperatureOverride) {
      generationConfig.temperature = prompt.temperatureOverride;
    }

    const safetySettings: SafetySetting[] = [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const model = this.ai.getGenerativeModel({ model: 'gemini-pro', generationConfig, safetySettings });

    try {
      const result = await model.generateContent(prompt.text);
      return result.response.text();
    } catch (err) {
      LLMGenerator.logger.withError(err as Error);
      return null;
    }
  }
}

export { LLMGenerator };
