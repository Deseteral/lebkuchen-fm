export async function executeCommand(prompt: string): Promise<string> {
  // TODO: Error handling.
  return fetch('/api/commands/execute', { method: 'POST', body: prompt })
    .then((res) => res.json())
    .then((data) => data.textResponse);
}
