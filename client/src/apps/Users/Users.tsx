import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { createSignal, createEffect, For, Show } from 'solid-js';
import styles from './Users.module.css';
import { Button } from '@components/Button/Button';
import { getUsers } from '../../services/users-service';
import { User } from '../../types/user';
import { NewUserDialog } from './NewUserDialog';
import { UserPropertiesDialog } from './UserPropertiesDialog';
import { ApplicationServer } from '../../services/application-server';

const EDIT_DIALOG_APP_ID_PREFIX = 'users-properties-dialog:';

function Users() {
  const [showNewUserDialog, setShowNewUserDialog] = createSignal(false);
  const [openEditorUsernames, setOpenEditorUsernames] = createSignal<string[]>([]);
  const [users, setUsers] = createSignal<User[]>([]);
  const [selectedUsername, setSelectedUsername] = createSignal<string | null>(null);
  const [windowRect, setWindowRect] = createSignal({ x: 100, y: 100, w: 600, h: 400 });

  const refreshUserList = () => {
    getUsers().then((users) => {
      setUsers(users);
    });
  };

  const selectedUser = () => users().find((u) => u.username === selectedUsername()) ?? null;
  const userByUsername = (username: string) => users().find((u) => u.username === username) ?? null;

  const closeAllChildDialogs = () => {
    setShowNewUserDialog(false);
    setOpenEditorUsernames([]);
  };

  createEffect(() => {
    refreshUserList();
  });

  createEffect(() => {
    const availableUsernames = new Set(users().map((user) => user.username));
    setOpenEditorUsernames((prev) => prev.filter((username) => availableUsernames.has(username)));
  });

  const openNewDialog = () => {
    if (showNewUserDialog()) {
      ApplicationServer.focus('users-new-user-dialog');
      return;
    }

    setShowNewUserDialog(true);
  };

  const openPropertiesDialog = () => {
    const user = selectedUser();
    if (!user) return;

    const username = user.username;
    const appId = `${EDIT_DIALOG_APP_ID_PREFIX}${username}`;

    if (openEditorUsernames().includes(username)) {
      ApplicationServer.focus(appId);
      return;
    }

    setOpenEditorUsernames((prev) => [...prev, username]);
  };

  const closePropertiesDialog = (username: string) => {
    setOpenEditorUsernames((prev) => prev.filter((openUsername) => openUsername !== username));
  };

  return (
    <>
      <ApplicationWindow
        id="users"
        startSize={{ width: '600px', height: '400px' }}
        onRectChange={(x, y, w, h) => setWindowRect({ x, y, w, h })}
        onClose={closeAllChildDialogs}
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
            <Button onClick={openNewDialog}>New</Button>
            <Button disabled={!selectedUser()} onClick={openPropertiesDialog}>
              Edit
            </Button>
          </div>
        </div>
      </ApplicationWindow>

      <Show when={showNewUserDialog()}>
        <NewUserDialog
          startPosition={{ x: windowRect().x + 40, y: windowRect().y + 40 }}
          close={() => setShowNewUserDialog(false)}
          onUserCreated={refreshUserList}
        />
      </Show>

      <For each={openEditorUsernames()}>
        {(username) => (
          <Show when={userByUsername(username)}>
            {(user) => (
              <UserPropertiesDialog
                appId={`${EDIT_DIALOG_APP_ID_PREFIX}${username}`}
                startPosition={{ x: windowRect().x + 40, y: windowRect().y + 40 }}
                user={user()}
                close={() => closePropertiesDialog(username)}
                onSaved={refreshUserList}
              />
            )}
          </Show>
        )}
      </For>
    </>
  );
}

export { Users };
