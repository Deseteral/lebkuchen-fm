import { AuthRequestDto } from 'lebkuchen-fm-service';

function redirectTo(url: string) {
  window.location.replace(url);
}

function authenticate(data: AuthRequestDto) {
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  fetch('/auth', options).then(() => redirectTo('/'));
}

window.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.forms.namedItem('login-form') as HTMLFormElement;

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    authenticate({ username, password });
  });
});
