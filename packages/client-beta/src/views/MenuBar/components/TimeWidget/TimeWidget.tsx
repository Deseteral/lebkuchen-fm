import { createSignal } from 'solid-js';

const formatter = new Intl.DateTimeFormat('pl-PL', {
  hour: '2-digit',
  minute: '2-digit',
});

function getFormattedTime(): string {
  return formatter.format(new Date());
}

function TimeWidget() {
  const [time] = createSignal(getFormattedTime());

  return <div>{time()}</div>;
}

export { TimeWidget };
