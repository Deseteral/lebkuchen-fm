import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal } from 'solid-js';
import styles from './DebugSoundUploadForm.module.css';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';
import { SOUND_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { apiFetch } from '../../services/api-fetch';

/*
 * TODO: This is a very basic sound upload form that I've done just to have something to test
 *  adding new sounds. It works in the same way as v2 upload form did. We should replace it
 *  with actual admin app for sounds.
 */
function DebugSoundUploadForm() {
  const [showWindow, setShowWindow] = createSignal(false);
  let buttonRef!: HTMLButtonElement;
  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  const [error, setError] = createSignal('');

  const onSubmit = async (e: Event) => {
    setError('');
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const response = await apiFetch('/api/x-sounds', { method: 'POST', body: formData });
    const data = await response.json();

    if (response.status >= 200 && response.status < 300) {
      setError(`Added new sound ${JSON.stringify(data)}`);
    } else {
      setError(`Could not add new sound: ${data.message}`);
    }

    form.reset();
  };

  return (
    <>
      <DesktopIcon
        label="Sound Manager"
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
        iconIndex={SOUND_MANAGER_ICON_INDEX}
      />
      {showWindow() && (
        <AppWindow
          title="[DEBUG] Sound upload form"
          close={() => setShowWindow(false)}
          startSize={{ width: '600px', height: '600px' }}
          iconIndex={SOUND_MANAGER_ICON_INDEX}
        >
          <div class={styles.container}>
            <h1>Add new sound</h1>
            <span class={styles.error}>{error()}</span>
            <form onSubmit={onSubmit}>
              <Input type="file" required name="soundFile" />
              <Input type="text" required placeholder="Sound name" name="soundName" />
              <Input type="text" placeholder="Tags, separate them with a comma" name="tags" />
              <Button fullWidth>Upload</Button>
            </form>
          </div>
        </AppWindow>
      )}
    </>
  );
}

export { DebugSoundUploadForm };
