import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal, createEffect, For } from 'solid-js';
import gearSolidIcon from '../../icons/gear-solid.svg';
import styles from './Users.module.css';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';
import { getUsers } from '../../services/users-service';
import { User } from '../../types/user';

/*
 * TODO: This is a very basic app as my first contribution to the front.
 *       We should replace it with correct user management component.
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

  const onSubmit = async (e: Event) => {
    setError('');
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const asSearchParams = new URLSearchParams(formData as unknown as Record<string, string>);
    const asString = asSearchParams.toString();

    // TODO:
    // - url encoded or data form?
    // - discord as empty id handled on front or backend

    const response = await fetch('/api/users', {
      method: 'POST',
      body: asString,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      const data = await response.json();
      setError(`Added new user ${JSON.stringify(data)}`);
    } else {
      const text = await response.text();
      setError(`Could not add new user: ${text}`);
    }

    form.reset();
    getUsers().then((users) => {
      setUsers(users);
    });
  };

  createEffect(() => {
    getUsers().then((users) => {
      setUsers(users);
    });
  });

  return (
    <>
      <DesktopIcon
        label="Users"
        imgSrc={gearSolidIcon}
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
      />
      {showWindow() && (
        <AppWindow
          title="[WIP] Users management"
          close={() => setShowWindow(false)}
          startSize={{ width: '600px', height: '600px' }}
        >
          <div class={styles.container}>
            <div class={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">DiscordId</th>
                    <th scope="col">Created</th>
                    <th scope="col">Last logged in</th>
                  </tr>
                </thead>
                <tbody>
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
  const { username, discordId, creationDate, lastLoggedIn } = user;

  const cd = new Date(creationDate).toLocaleDateString('pl-PL');
  const ld = new Date(lastLoggedIn).toLocaleString('pl-PL');

  return (
    <tr>
      <td>{`${username}`}</td>
      <td>{`${discordId ?? ''}`}</td>
      <td>{`${cd}`}</td>
      <td>{`${ld}`}</td>
    </tr>
  );
}

export { Users };
