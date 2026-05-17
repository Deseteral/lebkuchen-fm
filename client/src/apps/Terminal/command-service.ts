import { TextCommandResponse } from '../../types/commands';
import { ApiHttpError, apiFetchJson } from '../../services/api-fetch';

export async function executeCommand(prompt: string): Promise<string> {
  try {
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
  } catch (error) {
    if (error instanceof ApiHttpError && error.body && typeof error.body === 'object') {
      const body = error.body as TextCommandResponse;
      if (body.textResponse) {
        return body.textResponse;
      }
    }
    throw error;
  }
}
