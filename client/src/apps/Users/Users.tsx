import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal, createEffect, For } from 'solid-js';
import { USER_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import styles from './Users.module.css';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';
import { getUsers, postUser } from '../../services/users-service';
import { User } from '../../types/user';

/*
 * TODO: This is a very basic app.
 *       We should replace it with correct user management component or at least polish this one.
 */
function Users() {
  const [showWindow, setShowWindow] = createSignal(false);
  let buttonRef!: HTMLButtonElement;
  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  const [error, setError] = createSignal('');
  const [users, setUsers] = createSignal([]);

  const refreshUserList = () => {
    getUsers().then((users) => {
      setUsers(users);
    });
  };

  const onSubmit = async (e: Event) => {
    setError('');
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    await postUser(formData)
      .then((user) => setError(JSON.stringify(user)))
      .catch((error) => setError(error.message));

    form.reset();
    refreshUserList();
  };

  createEffect(() => {
    refreshUserList();
  });

  return (
    <>
      <DesktopIcon
        label="Users"
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
        iconIndex={USER_MANAGER_ICON_INDEX}
      />
      {showWindow() && (
        <AppWindow
          title="[WIP] Users management"
          close={() => setShowWindow(false)}
          startSize={{ width: '600px', height: '600px' }}
          iconIndex={USER_MANAGER_ICON_INDEX}
        >
          <div class={styles.container}>
            <div class={styles.tableWrapper}>
              <table class={styles.usersTable}>
                <thead>
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">DiscordId</th>
                    <th scope="col">Created</th>
                    <th scope="col">Last logged in</th>
                  </tr>
                </thead>
                <tbody>
                  {users() == undefined && (
                    <tr>
                      <td>Something went wrong.</td>
                    </tr>
                  )}
                  <For each={users()}>{(user: User) => UserLine(user)}</For>
                </tbody>
              </table>
            </div>
            <h1>Add new user</h1>
            <form onSubmit={onSubmit}>
              <Input type="user" required placeholder="Username" name="username" />
              <Input type="text" placeholder="DiscordId" name="discordId" />
              <Button primary>Create</Button>
            </form>
            <span class={styles.error}>{error()}</span>
          </div>
        </AppWindow>
      )}
    </>
  );
}

function UserLine(user: User) {
  return (
    <tr>
      <td>{`${user.username}`}</td>
      <td>{`${user.discordId ?? ''}`}</td>
      <td>{`${new Date(user.creationDate).toLocaleDateString('en-GB')}`}</td>
      <td>{`${new Date(user.lastLoggedIn).toLocaleString('en-GB')}`}</td>
    </tr>
  );
}

export { Users };
