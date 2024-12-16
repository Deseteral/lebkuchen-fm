import styles from './Login.module.css';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { createSignal } from 'solid-js';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { ProblemResponse } from '../../types/problem-response';
import { USER_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';

const LOGIN_WINDOW_WIDTH = 400;
const LOGIN_WINDOW_HEIGHT = 350;

function Login() {
  const [error, setError] = createSignal('');

  const onSubmit = (e: Event) => {
    setError('');
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const login = form.login.value;
    const password = form.password.value;

    UserAccountService.userLogin(login, password).catch((problem: ProblemResponse) => {
      setError(problem.detail);
    });
  };

  return (
    <>
      <MenuBar isUserLoggedIn={false} />
      <AppWindow
        title="Login"
        startSize={{ width: `${LOGIN_WINDOW_WIDTH}px`, height: `${LOGIN_WINDOW_HEIGHT}px` }}
        centered
        iconIndex={USER_MANAGER_ICON_INDEX}
      >
        <div class={styles.container}>
          <h1>Login</h1>
          <span class={styles.error}>{error()}</span>
          <form onSubmit={onSubmit}>
            <Input type="text" name="login" placeholder="Login" required />
            <Input type="password" name="password" placeholder="Password" required />
            <Button primary>Login</Button>
          </form>
        </div>
      </AppWindow>
    </>
  );
}

export { Login };
