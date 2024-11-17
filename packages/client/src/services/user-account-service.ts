import { redirectTo } from './redirect-to';

export function userLogin(username: string, password: string) {
  const body = new URLSearchParams();
  body.set('username', username);
  body.set('password', password);

  const options: RequestInit = {
    method: 'POST',
    body,
  };

  fetch('/api/auth', options).then(() => redirectTo('/'));
}

export function userLogout() {
  fetch('/api/auth/logout', { method: 'POST' }).then(() => redirectTo('/login'));
}

export async function checkLoginStateAndRedirect() {
  fetch('/api/auth').then((res) => {
    if (res.status === 401 && window.location.pathname !== '/login') redirectTo('/login');
  });
}
