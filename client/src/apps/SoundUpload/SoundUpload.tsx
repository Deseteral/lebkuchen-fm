import { ApplicationWindow } from '@components/ApplicationWindow/ApplicationWindow';
import { createSignal, Show } from 'solid-js';
import styles from './SoundUpload.module.css';
import { Input } from '@components/Input/Input';
import { Button } from '@components/Button/Button';
import { Dialog } from '@components/Dialog/Dialog';
import type { DialogVariant } from '@components/Dialog/Dialog';
import { ApiHttpError, apiFetchOrThrow } from '../../services/api-fetch';

interface DialogState {
  variant: DialogVariant;
  message: string;
}

function SoundUpload() {
  const [isUploading, setIsUploading] = createSignal(false);
  const [dialogState, setDialogState] = createSignal<DialogState | null>(null);
  let formRef!: HTMLFormElement;

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef);
    const soundName = formData.get('soundName') as string;
    setIsUploading(true);

    try {
      await apiFetchOrThrow('/api/x-sounds', { method: 'POST', body: formData });

      formRef.reset();
      setDialogState({
        variant: 'success',
        message: `Sound '${soundName}' uploaded successfully.`,
      });
    } catch (error) {
      if (error instanceof ApiHttpError && error.body && typeof error.body === 'object') {
        const body = error.body as { detail?: string; message?: string };
        setDialogState({
          variant: 'error',
          message: body.detail ?? body.message ?? 'Could not upload sound.',
        });
      } else {
        setDialogState({
          variant: 'error',
          message: 'An unexpected error occurred.',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <ApplicationWindow id="sound-upload" startSize={{ width: '420px', height: '360px' }}>
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
      </ApplicationWindow>

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
