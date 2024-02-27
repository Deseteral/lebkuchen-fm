import type { AddUserRequestDto, LLMPrompt, LLMPromptsInfoResponseDto, LLMPromptsResponseDto, LLMPromptTypeVariants } from 'lebkuchen-fm-service';
import { UserData, UsersResponseDto } from 'lebkuchen-fm-service';

export async function getUserList(): Promise<UserData[]> {
  const res = await fetch('/api/users');
  const data: UsersResponseDto = await res.json();
  return data.users;
}

export async function addNewUser(username: string): Promise<void> {
  const data: AddUserRequestDto = { username };
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };

  await fetch('/api/users', options);
}

export async function getPromptTypeVariants(): Promise<LLMPromptTypeVariants> {
  const res = await fetch('/api/llm-prompts/info');
  const data: LLMPromptsInfoResponseDto = await res.json();
  return data.variants;
}

export async function getPrompts(type: string, variant: string): Promise<LLMPrompt[]> {
  const res = await fetch(`/api/llm-prompts/${type}/${variant}`);
  const data: LLMPromptsResponseDto = await res.json();
  return data.prompts;
}
