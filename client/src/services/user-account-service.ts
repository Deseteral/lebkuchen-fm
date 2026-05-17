import { redirectTo } from './redirect-to';
import { ApiHttpError, apiFetchOrThrow } from './api-fetch';
import { ProblemResponse } from '../types/problem-response';

class UserAccountService {
  static async checkLoginStateAndRedirect() {
    try {
      await apiFetchOrThrow('/api/auth');
    } catch {
      // redirect is handled by apiFetch on 401
    }
  }

  static async userLogin(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const options: RequestInit = {
      method: 'POST',
      body,
    };

    try {
      await apiFetchOrThrow('/api/auth', {
        ...options,
        redirectOnUnauthorized: false,
      });
      redirectTo('/');
    } catch (error) {
      if (error instanceof ApiHttpError && error.body && typeof error.body === 'object') {
        throw error.body as ProblemResponse;
      }
      throw error;
    }
  }

  static async userLogout() {
    await apiFetchOrThrow('/api/auth/logout', { method: 'POST' });
    redirectTo('/login');
  }
}

export { UserAccountService };
