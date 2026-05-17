import { User } from '../types/user';
import { apiFetchJson } from '../services/api-fetch';

interface UsersResponse {
  users: User[];
}

export async function getUsers(): Promise<User[]> {
  const data = await apiFetchJson<UsersResponse>('/api/users');
  return data.users;
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

  return await apiFetchJson<User>('/api/users', options);
}

export async function putUserRoles(username: string, roles: string[]): Promise<User> {
  return await apiFetchJson<User>(`/api/users/${encodeURIComponent(username)}/roles`, {
    method: 'PUT',
    body: JSON.stringify({ roles }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}
