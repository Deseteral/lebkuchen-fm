import { TextCommandResponse } from '../../types/commands';

export async function executeCommand(prompt: string): Promise<string> {
  const response = await fetch('/api/commands/execute', {
    method: 'POST',
    body: prompt,
    headers: { 'Command-Prompt': 'fm' },
  });

  if (!response.ok) {
    throw new Error('Request to LebkuchenFM service failed.');
  }

  const data: TextCommandResponse = await response.json();
  return data.textResponse;
}
