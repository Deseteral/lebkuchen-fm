import { TERMINAL_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { For, createSignal } from 'solid-js';
import styles from './Terminal.module.css';
import { programs } from './programs';

export function Terminal() {
  const [showWindow, setShowWindow] = createSignal(false);
  let buttonRef!: HTMLButtonElement;
  const closeWindow = () => setShowWindow(false);
  const toggleWindow = () => {
    setShowWindow((prev: boolean) => !prev);
    if (buttonRef) {
      buttonRef.blur();
    }
  };

  return (
    <>
      <DesktopIcon
        label="Terminal"
        buttonRef={(el: HTMLButtonElement) => (buttonRef = el)}
        toggleWindow={toggleWindow}
        iconIndex={TERMINAL_ICON_INDEX}
      />
      {showWindow() && (
        <AppWindow
          title="Terminal"
          close={closeWindow}
          startSize={{ width: '624px', height: '400px' }}
          iconIndex={TERMINAL_ICON_INDEX}
        >
          <Buffer />
        </AppWindow>
      )}
    </>
  );
}

const WELCOME_MESSAGE = 'Welcome to LebkuchenFM!';

function Buffer() {
  let bufferElement!: HTMLDivElement;
  let promptElement!: HTMLInputElement;

  const [lines, setLines] = createSignal<string[]>([WELCOME_MESSAGE, '']);

  const scrollToBottom = (): void => {
    bufferElement.scrollTop = bufferElement.scrollHeight;
  };

  const setPrompt = (value: string): void => {
    promptElement.value = value;
  };

  const appendBufferLines = (newLines: string[]): void => {
    setLines([...lines(), ...newLines]);
    scrollToBottom();
  };

  const evalPrompt = async (prompt: string): Promise<void> => {
    appendBufferLines([`> ${prompt}`]);

    const [command, ...args] = prompt.split(' ').filter((s) => !!s);
    if (!command) {
      appendBufferLines(['']);
      return;
    }

    const program = programs[command];
    if (!program) {
      appendBufferLines([`${command}: command not found`]);
      return;
    }

    try {
      const output = await program(args);
      appendBufferLines(output);
    } catch (err) {
      appendBufferLines(['Something went wrong.']);
      if (err instanceof Error) {
        appendBufferLines(err.message.split('\n'));
      }
    }
  };

  return (
    <div class={styles.buffer} ref={bufferElement}>
      <For each={lines()}>{(line) => <div>{line}</div>}</For>

      <div class={styles.promptContainer}>
        <div>$&nbsp;</div>
        <input
          class={styles.prompt}
          type="text"
          ref={promptElement}
          onKeyDown={(e) => {
            switch (e.key) {
              case 'Enter':
                evalPrompt(promptElement.value.trim());
                setPrompt('');
                break;
            }
          }}
        />
      </div>
    </div>
  );
}
