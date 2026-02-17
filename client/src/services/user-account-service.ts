import { redirectTo } from './redirect-to';
import { apiFetch } from './api-fetch';

class UserAccountService {
  static checkLoginStateAndRedirect() {
    apiFetch('/api/auth');
  }

  static async userLogin(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const options: RequestInit = {
      method: 'POST',
      body,
    };

    const response = await fetch('/api/auth', options);
    if (response.status === 200) {
      redirectTo('/');
    } else {
      throw await response.json();
    }
  }

  static userLogout() {
    apiFetch('/api/auth/logout', { method: 'POST' }).then(() => redirectTo('/login'));
  }
}

export { UserAccountService };
