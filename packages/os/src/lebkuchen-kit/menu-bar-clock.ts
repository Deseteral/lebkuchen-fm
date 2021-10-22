const timeFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' });

function printTime(): string {
  return timeFormatter.format(new Date());
}

export function MenuBarClock(): HTMLElement {
  const clock = document.createElement('div');
  clock.innerText = printTime();

  setInterval(() => {
    clock.innerText = printTime();
  }, 500);

  return clock;
}
