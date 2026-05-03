import { TextCommandResponse } from '../../types/commands';

export async function executeCommand(prompt: string): Promise<string> {
  const response = await fetch('/api/commands/execute', {
    method: 'POST',
    body: prompt,
    headers: { 'Command-Prompt': 'fm' },
  });

  const data = await response.json();
  if (data.textResponse) {
    return (data as TextCommandResponse).textResponse;
  } else {
    throw new Error('Request to LebkuchenFM service failed.');
  }
}
