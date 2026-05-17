import { apiFetch } from './api-fetch';

export interface SecretState {
  set: boolean;
  suffix: string | null;
  length: number | null;
}

export interface DropboxIntegrationResponse {
  appKey: SecretState;
  appSecret: SecretState;
  refreshToken: SecretState;
  xSoundsPath: string | null;
}

export interface YoutubeIntegrationResponse {
  apiKey: SecretState;
}

export interface DiscordIntegrationResponse {
  token: SecretState;
  channelId: string | null;
  commandPrompt: string | null;
}

export interface IntegrationsResponse {
  dropbox: DropboxIntegrationResponse;
  youtube: YoutubeIntegrationResponse;
  discord: DiscordIntegrationResponse;
}

export interface DropboxPatchRequest {
  appKey?: string;
  appSecret?: string;
  refreshToken?: string;
  xSoundsPath?: string;
}

export interface YoutubePatchRequest {
  apiKey?: string;
}

export interface DiscordPatchRequest {
  token?: string;
  channelId?: string;
  commandPrompt?: string;
}

export interface IntegrationsPatchRequest {
  dropbox?: DropboxPatchRequest;
  youtube?: YoutubePatchRequest;
  discord?: DiscordPatchRequest;
}

export async function getIntegrations(): Promise<IntegrationsResponse> {
  const response = await apiFetch('/api/integrations');

  if (!response.ok) {
    throw response;
  }

  return await response.json();
}

export async function patchIntegrations(
  patch: IntegrationsPatchRequest,
): Promise<IntegrationsResponse> {
  const response = await apiFetch('/api/integrations', {
    method: 'PATCH',
    body: JSON.stringify(patch),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw response;
  }

  return await response.json();
}
