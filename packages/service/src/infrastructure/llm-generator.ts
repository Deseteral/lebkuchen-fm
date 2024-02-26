import { GenerationConfig, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SafetySetting } from '@google/generative-ai';
import { Configuration } from '@service/infrastructure/configuration';
import { Service } from 'typedi';
import { Logger } from '@service/infrastructure/logger';
import { LLMGeneratorQuery } from '@service/domain/llm-prompts/llm-generator-query';

@Service()
class LLMGenerator {
  private static readonly logger = new Logger('llm-generator');

  private ai: GoogleGenerativeAI;

  constructor(private configuration: Configuration) {
    this.ai = new GoogleGenerativeAI(this.configuration.GEMINI_TOKEN);
  }

  async generateTextForQuery(query: LLMGeneratorQuery): Promise<string | null> {
    const generationConfig: GenerationConfig = {};

    if (query.prompt.temperatureOverride) {
      generationConfig.temperature = query.prompt.temperatureOverride;
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

    let promptText = query.prompt.text;
    query.variables.forEach(([key, value]) => {
      promptText = promptText.replaceAll(`{{${key}}}`, value);
    });

    try {
      const result = await model.generateContent(promptText);
      return result.response.text();
    } catch (err) {
      LLMGenerator.logger.withError(err as Error);
      return null;
    }
  }
}

export { LLMGenerator };
