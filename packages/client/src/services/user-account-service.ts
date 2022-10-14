import { AuthRequestDto } from 'lebkuchen-fm-service';
import { redirectTo } from './redirect-to';

export function userLogin(username: string, password: string) {
  const data: AuthRequestDto = { username, password };
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch('/api/auth', options).then(() => redirectTo('/'));
}

export function userLogout() {
  fetch('/api/auth/logout', { method: 'POST' }).then(() => redirectTo('/login'));
}

export async function checkLoginStateAndRedirect() {
  fetch('/api/auth').then((res) => {
    if (res.status === 401) redirectTo('/login');
  });
}
