import { redirectTo } from './redirect-to';

class UserAccountService {
  static checkLoginStateAndRedirect() {
    fetch('/api/auth').then((res) => {
      if (res.status === 401 && window.location.pathname !== '/login') {
        redirectTo('/login');
      }
    });
  }

  static userLogin(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const options: RequestInit = {
      method: 'POST',
      body,
    };

    return fetch('/api/auth', options).then(({ status }) => {
      if (status === 200) {
        redirectTo('/');
      } else {
        throw new Error('Login failed');
      }
    });
  }

  static userLogout() {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => redirectTo('/login'));
  }
}

export { UserAccountService };
