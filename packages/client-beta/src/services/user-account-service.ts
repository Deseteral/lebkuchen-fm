import { redirectTo } from './redirect-to';

export async function checkLoginStateAndRedirect() {
  fetch('/api/auth').then((res) => {
    if (res.status === 401 && window.location.pathname !== '/login') redirectTo('/login');
  });
}
