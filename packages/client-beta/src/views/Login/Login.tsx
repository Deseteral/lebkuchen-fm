import styles from './Login.module.css';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { createSignal } from 'solid-js';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '../MenuBar/MenuBar';

function Login() {
  const [login, setLogin] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');

  const onLoginChange = (e: Event) => {
    setLogin((e.target as HTMLInputElement).value);
  };

  const onPasswordChange = (e: Event) => {
    setPassword((e.target as HTMLInputElement).value);
  };

  const onSubmit = (e: Event) => {
    setError('');
    e.preventDefault();
    UserAccountService.userLogin(login(), password()).catch(() => {
      setError('Wrong login or password');
    });
  };

  return (
    <>
      <MenuBar isUserLoggedIn={false} />
      <AppWindow title="Sign in" close={() => {}} startSize={{ width: '400px' }}>
        <div class={styles.container}>
          <h1>Sign in</h1>
          <span class={styles.error}>{error()}</span>
          <form onSubmit={onSubmit}>
            <Input
              type="text"
              placeholder="Login"
              value={login()}
              onInput={onLoginChange}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password()}
              onInput={onPasswordChange}
              required
            />
            <Button primary>Login</Button>
          </form>
        </div>
      </AppWindow>
    </>
  );
}

export { Login };
