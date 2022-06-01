import { UserData, UsersResponseDto } from 'lebkuchen-fm-service';

export async function getUserList(): Promise<UserData[]> {
  const res = await fetch('/api/users');
  const data: UsersResponseDto = await res.json();
  return data.users;
}
