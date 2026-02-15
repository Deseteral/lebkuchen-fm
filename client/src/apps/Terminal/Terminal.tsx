import { TERMINAL_ICON_INDEX } from '@components/AppIcon/IconSpritesheet';
import { AppWindow } from '@components/AppWindow/AppWindow';
import { DesktopIcon } from '@components/DesktopIcon/DesktopIcon';
import { For, createSignal } from 'solid-js';
import styles from './Terminal.module.css';
import { programs, TerminalProgram } from './programs';

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

  const [bufferLines, setBufferLines] = createSignal<string[]>([WELCOME_MESSAGE, '']);

  const [promptHistory, setPromptHistory] = createSignal<string[]>([]);
  const [promptHistoryIdx, setPromptHistoryIdx] = createSignal<number>(-1);

  const scrollToBottom = (): void => {
    bufferElement.scrollTop = bufferElement.scrollHeight;
  };

  const setPrompt = (value: string): void => {
    promptElement.value = value;
  };

  const clearPrompt = (): void => {
    setPromptHistoryIdx(-1);
    setPrompt('');
  }

  const setPromptFromHistory = (offset: 1 | -1): void => {
    const nextIdx = Math.clamp(promptHistoryIdx() + offset, -1, promptHistory().length - 1);
    setPromptHistoryIdx(nextIdx);
    const prompt = nextIdx === -1 ? '' : promptHistory()[nextIdx]!;
    setPrompt(prompt);
  };

  const appendBufferLines = (newLines: string[]): void => {
    setBufferLines([...bufferLines(), ...newLines]);
    scrollToBottom();
  };

  const appendPromptHistory = (prompt: string) => setPromptHistory([prompt, ...promptHistory()]);

  const evalPrompt = async (prompt: string): Promise<void> => {
    appendBufferLines([`> ${prompt}`]);

    if (prompt && prompt !== promptHistory()[0]) appendPromptHistory(prompt);
    clearPrompt();

    const [command, ...args] = prompt.split(' ').filter((s) => !!s);
    if (!command) {
      appendBufferLines(['']);
      return;
    }

    const program: TerminalProgram | undefined = programs[command];
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
      <For each={bufferLines()}>{(line) => <div>{line}</div>}</For>

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
                break;

              case 'ArrowUp':
                setPromptFromHistory(+1);
                break;

              case 'ArrowDown':
                setPromptFromHistory(-1);
                break;

              case 'Escape':
                clearPrompt();
                break
            }
          }}
        />
      </div>
    </div>
  );
}
