import { TextCommandResponse } from '../../types/commands';
import { apiFetchJson } from '../../services/api-fetch';

export async function executeCommand(prompt: string): Promise<string> {
  const data = await apiFetchJson<TextCommandResponse>('/api/commands/execute', {
    method: 'POST',
    body: prompt,
    headers: { 'Command-Prompt': 'fm' },
  });

  if (data.textResponse) {
    return data.textResponse;
  } else {
    throw new Error('Request to LebkuchenFM service failed.');
  }
}
