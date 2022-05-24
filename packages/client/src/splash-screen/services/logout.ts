import { redirectTo } from '../../services/redirect-to';

export async function logout() {
  await fetch('/auth/logout', { method: 'POST' });
  redirectTo('/login');
}
