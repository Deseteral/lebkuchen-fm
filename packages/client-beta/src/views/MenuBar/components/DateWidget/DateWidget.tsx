import { createSignal, onCleanup, onMount } from 'solid-js';

const ONE_MINUTE = 1000;

function getFormattedDate(): string {
  return new Date().toLocaleDateString('pl-PL', {
    day: 'numeric',
    year: 'numeric',
    month: 'short',
    weekday: 'short',
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
