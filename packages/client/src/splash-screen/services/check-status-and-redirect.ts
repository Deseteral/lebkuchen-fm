import { redirectTo } from '../../services/redirect-to';

export async function checkLoginStatusAndRedirect() {
  const res = await fetch('/auth');
  if (res.status === 401) {
    redirectTo('/login');
  }
}
