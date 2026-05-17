import { redirectTo } from './redirect-to';

interface ApiFetchInit extends RequestInit {
  redirectOnUnauthorized?: boolean;
}

class ApiHttpError extends Error {
  status: number;
  body: unknown;
  response: Response;

  constructor(response: Response, body: unknown, message?: string) {
    super(message ?? `Request failed with status ${response.status}`);
    this.name = 'ApiHttpError';
    this.status = response.status;
    this.body = body;
    this.response = response;
  }
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const { redirectOnUnauthorized = true, ...requestInit } = (init ?? {}) as ApiFetchInit;
  const response = await fetch(input, requestInit);

  if (response.status === 401) {
    if (redirectOnUnauthorized) {
      redirectTo('/login');
    }
  }

  return response;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}

export async function apiFetchOrThrow(
  input: RequestInfo | URL,
  init?: ApiFetchInit,
): Promise<Response> {
  const response = await apiFetch(input, init);

  if (!response.ok) {
    const body = await readResponseBody(response);
    throw new ApiHttpError(response, body);
  }

  return response;
}

export async function apiFetchJson<T>(input: RequestInfo | URL, init?: ApiFetchInit): Promise<T> {
  const response = await apiFetchOrThrow(input, init);
  return (await readResponseBody(response)) as T;
}

export { ApiHttpError, readResponseBody };
