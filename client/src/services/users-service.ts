import { User } from '../types/user';
import { apiFetch } from '../services/api-fetch';

export async function getUsers(): Promise<User[]> {
  return apiFetch('/api/users')
    .then((res) => res.json())
    .then((res) => res.users);
}

export async function postUser(formData: FormData): Promise<User> {
  const formObject = Object.fromEntries(formData.entries());
  const body = JSON.stringify(formObject);
  const options = {
    method: 'POST',
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await apiFetch('/api/users', options);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

export async function putUserRoles(username: string, roles: string[]): Promise<User> {
  const response = await apiFetch(`/api/users/${encodeURIComponent(username)}/roles`, {
    method: 'PUT',
    body: JSON.stringify({ roles }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}
