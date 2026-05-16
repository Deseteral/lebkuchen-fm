import { DesktopApp } from '@components/DesktopApp/DesktopApp';
import { createSignal, createEffect, For, Show } from 'solid-js';
import { USER_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import styles from './Users.module.css';
import { Button } from '@components/Button/Button';
import { getUsers } from '../../services/users-service';
import { User } from '../../types/user';
import { NewUserDialog } from './NewUserDialog';
import { UserPropertiesDialog } from './UserPropertiesDialog';

function Users() {
  const [showNewUserDialog, setShowNewUserDialog] = createSignal(false);
  const [showPropertiesDialog, setShowPropertiesDialog] = createSignal(false);
  const [users, setUsers] = createSignal<User[]>([]);
  const [selectedUsername, setSelectedUsername] = createSignal<string | null>(null);
  const [windowRect, setWindowRect] = createSignal({ x: 100, y: 100, w: 600, h: 400 });

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
      <DesktopApp
        id="users"
        title="Users"
        iconIndex={USER_MANAGER_ICON_INDEX}
        startSize={{ width: '600px', height: '400px' }}
        onRectChange={(x, y, w, h) => setWindowRect({ x, y, w, h })}
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
                      class={selectedUsername() === user.username ? styles.selectedRow : undefined}
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
      </DesktopApp>

      <Show when={showNewUserDialog()}>
        <NewUserDialog
          startPosition={{ x: windowRect().x + 40, y: windowRect().y + 40 }}
          close={() => setShowNewUserDialog(false)}
          onUserCreated={refreshUserList}
        />
      </Show>

      <Show when={showPropertiesDialog() && selectedUser()}>
        <UserPropertiesDialog
          startPosition={{ x: windowRect().x + 40, y: windowRect().y + 40 }}
          user={selectedUser()!}
          close={() => setShowPropertiesDialog(false)}
          onSaved={refreshUserList}
        />
      </Show>
    </>
  );
}

export { Users };
