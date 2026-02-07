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

  const scrollToBottom = () => (bufferElement.scrollTop = bufferElement.scrollHeight);

  const setPrompt = (value: string) => (promptElement.value = value);

  const [lines, setLines] = createSignal<string[]>([WELCOME_MESSAGE, '']);
  const appendLines = (newLines: string[]) => {
    setLines([...lines(), ...newLines]);
    scrollToBottom();
  };

  // TODO: Prompt history could be saved to localStorage.
  const [history, setHistory] = createSignal<string[]>([]);
  const [historyIdx, setHistoryIdx] = createSignal<number>(-1);
  const appendHistory = (prompt: string) => setHistory([prompt, ...history()]);
  const fromHistory = (offset: 1 | -1): string => {
    const nextIdx = clamp(historyIdx() + offset, -1, history().length - 1);
    setHistoryIdx(nextIdx);
    return nextIdx === -1 ? '' : history()[nextIdx]!;
  };

  const evalPrompt = async (prompt: string) => {
    appendLines([`> ${prompt}`]);

    if (!!prompt) appendHistory(prompt);
    setHistoryIdx(-1);

    const [command, ...args] = prompt.split(' ').filter((s) => !!s);
    if (!command) {
      appendLines(['']);
      return;
    }

    const program = programs[command];
    if (!program) {
      appendLines([`${command}: command not found`]);
      return;
    }

    try {
      const output = await program(args);
      appendLines(output);
    } catch (err) {
      appendLines(['Something went wrong.']);
      if (err instanceof Error) {
        appendLines(err.message.split('\n'));
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

              case 'ArrowUp':
                setPrompt(fromHistory(+1));
                break;

              case 'ArrowDown':
                setPrompt(fromHistory(-1));
                break;
            }
          }}
        />
      </div>
    </div>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
