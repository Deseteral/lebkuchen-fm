import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal, createEffect, For, Show } from 'solid-js';
import { USER_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import styles from './Users.module.css';
import { Button } from '@components/Button/Button';
import { getUsers } from '../../services/users-service';
import { User } from '../../types/user';
import { NewUserDialog } from './NewUserDialog';
import { UserPropertiesDialog } from './UserPropertiesDialog';

function Users() {
  const [showWindow, setShowWindow] = createSignal(false);
  const [showNewUserDialog, setShowNewUserDialog] = createSignal(false);
  const [showPropertiesDialog, setShowPropertiesDialog] = createSignal(false);
  const [users, setUsers] = createSignal<User[]>([]);
  const [selectedUsername, setSelectedUsername] = createSignal<string | null>(null);

  let buttonRef!: HTMLButtonElement;

  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  const refreshUserList = () => {
    getUsers().then((users) => {
      setUsers(users);
    });
  };

  const selectedUser = () => users().find((u) => u.username === selectedUsername()) ?? null;

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
          title="Users"
          close={() => setShowWindow(false)}
          startSize={{ width: '600px', height: '400px' }}
          iconIndex={USER_MANAGER_ICON_INDEX}
        >
          <div class={styles.container}>
            <div class={styles.tableWrapper}>
              <table class={styles.usersTable}>
                <thead>
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Roles</th>
                    <th scope="col">Discord ID</th>
                    <th scope="col">Created</th>
                    <th scope="col">Last logged in</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={users()}>
                    {(user: User) => (
                      <tr
                        class={
                          selectedUsername() === user.username ? styles.selectedRow : undefined
                        }
                        onClick={() => setSelectedUsername(user.username)}
                      >
                        <td>{user.username}</td>
                        <td>{user.roles.join(', ')}</td>
                        <td>{user.discordId ?? ''}</td>
                        <td>{new Date(user.creationDate).toLocaleDateString('en-GB')}</td>
                        <td>{new Date(user.lastLoggedIn).toLocaleString('en-GB')}</td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
            <div class={styles.toolbar}>
              <Button onClick={() => setShowNewUserDialog(true)}>New</Button>
              <Button disabled={!selectedUser()} onClick={() => setShowPropertiesDialog(true)}>
                Edit
              </Button>
            </div>
          </div>
        </AppWindow>
      )}

      <Show when={showNewUserDialog()}>
        <NewUserDialog close={() => setShowNewUserDialog(false)} onUserCreated={refreshUserList} />
      </Show>

      <Show when={showPropertiesDialog() && selectedUser()}>
        <UserPropertiesDialog
          user={selectedUser()!}
          close={() => setShowPropertiesDialog(false)}
          onSaved={refreshUserList}
        />
      </Show>
    </>
  );
}

export { Users };
