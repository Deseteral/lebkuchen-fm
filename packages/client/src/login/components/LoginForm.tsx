import { AuthRequestDto } from 'lebkuchen-fm-service';
import * as React from 'react';
import { redirectTo } from '../../services/redirect-to';

interface LoginFormProps {}

function LoginForm(_: LoginFormProps): JSX.Element {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const authenticate = () => {
    const data: AuthRequestDto = { username, password };
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch('/auth', options).then(() => redirectTo('/'));
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Login to LebkuchenFM</h3>
        <form name="login-form">
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="username">
                Username
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>

            <div className="mt-4">
              <label className="block" htmlFor="password">
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>

            <div className="flex items-baseline justify-between">
              <button type="button" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900" onClick={authenticate}>
                Login
              </button>
            </div>

            <div className="text-xs tracking-wide mt-4">
              If you are a new user or you&apos;ve forgotten your password, ask existing user for help.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export { LoginForm, LoginFormProps };
