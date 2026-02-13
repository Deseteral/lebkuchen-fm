export async function executeCommand(prompt: string): Promise<string> {
  return fetch('/api/commands/execute', { method: 'POST', body: prompt })
    .then((res) => res.json())
    .then((data) => data.textResponse);
}
