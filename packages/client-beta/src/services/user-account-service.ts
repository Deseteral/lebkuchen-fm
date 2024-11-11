import { redirectTo } from './redirect-to';


class UserAccountService {
  static checkLoginStateAndRedirect() {
    fetch('/api/auth').then((res) => {
      if (res.status === 401 && window.location.pathname !== '/login') {
        redirectTo('/login');
      }
    });
  }
}

export { UserAccountService };
