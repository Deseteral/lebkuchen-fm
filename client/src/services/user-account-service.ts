import { redirectTo } from './redirect-to';

class UserAccountService {
  static checkLoginStateAndRedirect() {
    fetch('/api/auth').then((res) => {
      if (res.status === 401 && window.location.pathname !== '/login') {
        redirectTo('/login');
      }
    });
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
    fetch('/api/auth/logout', { method: 'POST' }).then(() => redirectTo('/login'));
  }
}

export { UserAccountService };
