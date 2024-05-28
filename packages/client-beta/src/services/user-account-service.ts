import { AuthRequestDto } from 'lebkuchen-fm-service';
import { redirectTo } from './redirect-to';

export async function userLogin(username: string, password: string) {
  const data: AuthRequestDto = { username, password };
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch('/api/auth', options)
    .then((res) => {
      if(res.ok) {
        redirectTo('/')
      }

      return res;
    });
}

export function userLogout() {
  fetch('/api/auth/logout', { method: 'POST' }).then(() => redirectTo('/login'));
}

export async function checkLoginStateAndRedirect() {
  fetch('/api/auth').then((res) => {
    if (res.status === 401 && window.location.pathname !== '/login') redirectTo('/login');
  });
}
