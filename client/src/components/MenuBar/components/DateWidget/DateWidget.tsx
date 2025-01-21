import { createSignal, onCleanup, onMount } from 'solid-js';

const ONE_MINUTE = 60 * 1000;

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    year: 'numeric',
    month: 'short',
    weekday: 'long',
  });
}

function DateWidget() {
  const [date, setDate] = createSignal(getFormattedDate());
  const [intervalId, setIntervalId] = createSignal<number>();

  onMount(() => {
    const interval = setInterval(() => {
      setDate(getFormattedDate());
    }, ONE_MINUTE);

    setIntervalId(interval);
  });

  onCleanup(() => {
    clearInterval(intervalId());
  });

  return <div>{date()}</div>;
}

export { DateWidget };
