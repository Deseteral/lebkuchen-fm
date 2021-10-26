import h from 'hyperscript';

const timeFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' });

function printTime(): string {
  return timeFormatter.format(new Date());
}

export function MenuBarClock(): HTMLElement {
  const clock = h('div', printTime());

  setInterval(() => {
    clock.innerText = printTime();
  }, 500);

  return clock;
}
