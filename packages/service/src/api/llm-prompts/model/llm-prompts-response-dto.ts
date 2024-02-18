import { LLMPrompt } from '@service/domain/llm-prompts/llm-prompts';

interface LLMPromptsResponseDto {
  prompts: LLMPrompt[],
}

export {
  LLMPromptsResponseDto,
};
