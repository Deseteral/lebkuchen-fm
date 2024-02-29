import { LLMPrompt } from '@service/domain/llm-prompts/llm-prompts';

interface LLMGeneratorQuery {
  prompt: LLMPrompt,
  variables: ([string, string])[],
}

export {
  LLMGeneratorQuery,
};
