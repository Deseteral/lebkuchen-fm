import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal } from 'solid-js';
import soundboardIcon from '../../icons/soundboard-icon.svg';
import styles from './DebugSoundUploadForm.module.css';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';

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
    const response = await fetch('/api/x-sounds', { method: 'POST', body: formData });
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
        label="[DEBUG] Sound upload form.app"
        imgSrc={soundboardIcon}
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
      />
      {showWindow() && (
        <AppWindow
          title="[DEBUG] Sound upload form.app"
          close={() => setShowWindow(false)}
          startSize={{ width: '600px', height: '600px' }}
        >
          <div class={styles.container}>
            <h1>Add new sound</h1>
            <span class={styles.error}>{error()}</span>
            <form onSubmit={onSubmit}>
              <Input type="file" required name="soundFile" />
              <Input type="text" required placeholder="Sound name" name="soundName" />
              <Input type="text" placeholder="Tags, separate them with a comma" name="tags" />
              <Button primary>Upload</Button>
            </form>
          </div>
        </AppWindow>
      )}
    </>
  );
}

export { DebugSoundUploadForm };
