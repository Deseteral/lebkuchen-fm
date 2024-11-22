import { createSignal, onCleanup, onMount } from 'solid-js';

const FIVE_SECONDS = 5 * 1000;

const formatter = new Intl.DateTimeFormat('pl-PL', {
  hour: '2-digit',
  minute: '2-digit',
});

function getFormattedTime(): string {
  return formatter.format(new Date());
}

function TimeWidget() {
  const [time, setTime] = createSignal(getFormattedTime());
  const [intervalId, setIntervalId] = createSignal<NodeJS.Timer>();

  onMount(() => {
    const interval = setInterval(() => {
      setTime(getFormattedTime());
    }, FIVE_SECONDS);

    setIntervalId(interval);
  });

  onCleanup(() => {
    clearInterval(intervalId());
  });

  return <div>{time()}</div>;
}

export { TimeWidget };
