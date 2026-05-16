import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { createSignal, Show } from 'solid-js';
import styles from './SoundUpload.module.css';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';
import { Dialog } from '@components/Dialog/Dialog';
import type { DialogVariant } from '@components/Dialog/Dialog';
import { SOUND_MANAGER_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { apiFetch } from '../../services/api-fetch';

interface DialogState {
  variant: DialogVariant;
  message: string;
}

function SoundUpload() {
  const [showWindow, setShowWindow] = createSignal(false);
  const [isUploading, setIsUploading] = createSignal(false);
  const [dialogState, setDialogState] = createSignal<DialogState | null>(null);
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
    const soundName = formData.get('soundName') as string;
    setIsUploading(true);

    try {
      const response = await apiFetch('/api/x-sounds', { method: 'POST', body: formData });

      if (response.ok) {
        formRef.reset();
        setDialogState({
          variant: 'success',
          message: `Sound '${soundName}' uploaded successfully.`,
        });
      } else {
        const data = await response.json();
        setDialogState({
          variant: 'error',
          message: data.detail ?? data.message ?? 'Could not upload sound.',
        });
      }
    } catch {
      setDialogState({
        variant: 'error',
        message: 'An unexpected error occurred.',
      });
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
          appId="sound-upload"
          title="Sound upload"
          close={() => setShowWindow(false)}
          startSize={{ width: '420px', height: '360px' }}
          iconIndex={SOUND_MANAGER_ICON_INDEX}
        >
          <form class={styles.form} ref={(el) => (formRef = el)} onSubmit={onSubmit}>
            <h1 class={styles.heading}>Add new sound</h1>
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

      <Show when={dialogState()}>
        {(state) => (
          <Dialog
            variant={state().variant}
            message={state().message}
            close={() => setDialogState(null)}
          />
        )}
      </Show>
    </>
  );
}

export { SoundUpload };
