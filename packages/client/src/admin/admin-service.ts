import type { AddUserRequestDto } from 'lebkuchen-fm-service';
import { UserData, UsersResponseDto } from 'lebkuchen-fm-service';

export async function getUserList(): Promise<UserData[]> {
  const res = await fetch('/api/users');
  const data: UsersResponseDto = await res.json();
  return data.users;
}

export async function addNewUser(username: string): Promise<void> {
  const data: AddUserRequestDto = { username };
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };

  await fetch('/api/users', options);
}
