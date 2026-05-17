import styles from './Login.module.css';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { createSignal, Show } from 'solid-js';
import { UserAccountService } from '../../services/user-account-service';
import { MenuBar } from '@components/MenuBar/MenuBar';
import { USER_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { Dialog } from '@components/Dialog/Dialog';
import type { DialogVariant } from '@components/Dialog/Dialog';

interface DialogState {
  variant: DialogVariant;
  message: string;
}

const LOGIN_WINDOW_WIDTH = 400;
const LOGIN_WINDOW_HEIGHT = 350;

function Login() {
  const [dialogState, setDialogState] = createSignal<DialogState | null>(null);

  const onSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const login = form.login.value;
    const password = form.password.value;

    UserAccountService.userLogin(login, password).catch((error: unknown) => {
      const body = error as { detail?: string; message?: string } | null;
      setDialogState({
        variant: 'error',
        message: body?.detail ?? body?.message ?? 'An unexpected error occurred.',
      });
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
          <form onSubmit={onSubmit}>
            <Input type="text" name="login" placeholder="Login" required />
            <Input type="password" name="password" placeholder="Password" required />
            <Button fullWidth>Login</Button>
          </form>
        </div>
      </AppWindow>

      <Show when={dialogState()}>
        {(state) => (
          <Dialog
            variant={state().variant}
            message={state().message}
            close={() => setDialogState(null)}
          />
        )}
      </Show>
    </>
  );
}

export { Login };
