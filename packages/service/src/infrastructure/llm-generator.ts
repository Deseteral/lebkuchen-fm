import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SafetySetting } from '@google/generative-ai';
import { Configuration } from '@service/infrastructure/configuration';
import { Service } from 'typedi';

@Service()
class LLMGenerator {
  private ai: GoogleGenerativeAI;

  constructor(private configuration: Configuration) {
    this.ai = new GoogleGenerativeAI(this.configuration.GEMINI_TOKEN);
  }

  async generateTextForPrompt(prompt: string): Promise<string> {
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
    const model = this.ai.getGenerativeModel({ model: 'gemini-pro', safetySettings });

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

export { LLMGenerator };
