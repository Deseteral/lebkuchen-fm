import { AppWindow } from '@components/AppWindow/AppWindow';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';
import { ErrorDialog } from '@components/ErrorDialog/ErrorDialog';
import { USER_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { Component, createSignal, Show } from 'solid-js';
import { postUser } from '../../services/users-service';
import styles from './Users.module.css';

interface NewUserDialogProps {
  close: () => void;
  onUserCreated: () => void;
}

const NewUserDialog: Component<NewUserDialogProps> = (props) => {
  const [error, setError] = createSignal<string | null>(null);

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await postUser(formData);
      props.onUserCreated();
      props.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <>
      <AppWindow
        title="New User"
        close={props.close}
        centered
        startSize={{ width: '300px', height: '240px' }}
        iconIndex={USER_MANAGER_ICON_INDEX}
      >
        <form class={styles.dialogContent} onSubmit={onSubmit}>
          <Input type="text" required placeholder="Username" name="username" />
          <Input type="text" placeholder="Discord ID" name="discordId" />
          <div class={styles.dialogButtons}>
            <Button>Create</Button>
            <Button type="button" onClick={() => props.close()}>
              Cancel
            </Button>
          </div>
        </form>
      </AppWindow>

      <Show when={error()}>
        <ErrorDialog message={error()!} close={() => setError(null)} />
      </Show>
    </>
  );
};

export { NewUserDialog };
