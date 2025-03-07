import { User } from '../types/user';

export async function getUsers() {
  return fetch('/api/users')
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

  const response = await fetch('/api/users', options);

  if (response.ok === false) {
    throw new Error(await response.text());
  }

  return await response.json();
}
