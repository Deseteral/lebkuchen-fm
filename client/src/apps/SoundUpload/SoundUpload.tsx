import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal } from 'solid-js';
import styles from './SoundUpload.module.css';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';
import { ErrorDialog } from '@components/ErrorDialog/ErrorDialog';
import { SOUND_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { apiFetch } from '../../services/api-fetch';

function SoundUploadForm() {
  const [showWindow, setShowWindow] = createSignal(false);
  const [isUploading, setIsUploading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  let buttonRef!: HTMLButtonElement;
  let formRef!: HTMLFormElement;

  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef);
    setIsUploading(true);
    setError(null);

    try {
      const response = await apiFetch('/api/x-sounds', { method: 'POST', body: formData });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.detail ?? body.message ?? 'Could not upload sound.');
        return;
      }

      formRef.reset();
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsUploading(false);
    }
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
          title="Sound upload"
          close={() => setShowWindow(false)}
          startSize={{ width: '600px', height: '600px' }}
          iconIndex={SOUND_MANAGER_ICON_INDEX}
        >
          <form class={styles.container} ref={(el) => (formRef = el)} onSubmit={onSubmit}>
            <h1>Add new sound</h1>
            <Input type="file" required name="soundFile" disabled={isUploading()} />
            <Input
              type="text"
              required
              placeholder="Sound name"
              name="soundName"
              disabled={isUploading()}
            />
            <Input
              type="text"
              placeholder="Tags, separate them with a comma"
              name="tags"
              disabled={isUploading()}
            />
            <Button fullWidth disabled={isUploading()}>
              {isUploading() ? <span class={styles.spinnerText}>Uploading</span> : 'Upload'}
            </Button>
          </form>
        </AppWindow>
      )}
      {error() && <ErrorDialog message={error()!} close={() => setError(null)} />}
    </>
  );
}

export { SoundUploadForm as SoundUpload };
