import { AppWindow } from '@components/AppWindow/AppWindow';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';
import { ErrorDialog } from '@components/ErrorDialog/ErrorDialog';
import { USER_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { Component, createSignal, For, Show } from 'solid-js';
import { User } from '../../types/user';
import { putUserRoles } from '../../services/users-service';
import styles from './Users.module.css';

const AVAILABLE_ROLES = ['OWNER', 'DJ', 'HONKER', 'LISTENER'];

interface UserPropertiesDialogProps {
  user: User;
  close: () => void;
  onSaved: () => void;
}

const UserPropertiesDialog: Component<UserPropertiesDialogProps> = (props) => {
  const [selectedRoles, setSelectedRoles] = createSignal<string[]>([...props.user.roles]);
  const [error, setError] = createSignal<string | null>(null);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const onSave = async () => {
    try {
      await putUserRoles(props.user.username, selectedRoles());
      props.onSaved();
      props.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  return (
    <>
      <AppWindow
        title={`${props.user.username} — Properties`}
        close={props.close}
        centered
        startSize={{ width: '320px', height: '400px' }}
        iconIndex={USER_MANAGER_ICON_INDEX}
      >
        <div class={styles.dialogContent}>
          <label class={styles.fieldLabel}>
            Username
            <Input type="text" value={props.user.username} disabled />
          </label>

          <label class={styles.fieldLabel}>
            Discord ID
            <Input type="text" value={props.user.discordId ?? ''} disabled />
          </label>

          <fieldset class={styles.rolesFieldset}>
            <legend>Roles</legend>
            <For each={AVAILABLE_ROLES}>
              {(role) => (
                <label class={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedRoles().includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                  {role}
                </label>
              )}
            </For>
          </fieldset>

          <Button disabled>Delete password</Button>

          <div class={styles.dialogButtons}>
            <Button onClick={onSave}>Save</Button>
            <Button type="button" onClick={() => props.close()}>
              Cancel
            </Button>
          </div>
        </div>
      </AppWindow>

      <Show when={error()}>
        <ErrorDialog message={error()!} close={() => setError(null)} />
      </Show>
    </>
  );
};

export { UserPropertiesDialog };
