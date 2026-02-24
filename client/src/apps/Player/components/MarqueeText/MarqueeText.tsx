import { createEffect, createSignal, on, onCleanup } from 'solid-js';
import styles from './MarqueeText.module.css';

const SCROLL_SPEED_PX_PER_SEC = 50;
const SEPARATOR = ' \u2022\u2022\u2022 ';

interface MarqueeTextProps {
  text: string;
}

function MarqueeText(props: MarqueeTextProps) {
  const [shouldScroll, setShouldScroll] = createSignal(false);
  const [duration, setDuration] = createSignal(0);
  let containerRef!: HTMLDivElement;
  let measureRef!: HTMLSpanElement;

  const measure = () => {
    if (!containerRef || !measureRef) return;
    requestAnimationFrame(() => {
      const textWidth = measureRef.scrollWidth;
      const containerWidth = containerRef.clientWidth;
      const overflows = textWidth > containerWidth;

      setShouldScroll(overflows);

      if (overflows) {
        setDuration(textWidth / SCROLL_SPEED_PX_PER_SEC);
      }
    });
  };

  createEffect(on(() => props.text, measure));

  const resizeObserver = new ResizeObserver(measure);

  createEffect(() => {
    if (containerRef) {
      resizeObserver.observe(containerRef);
    }
  });

  onCleanup(() => {
    resizeObserver.disconnect();
  });

  return (
    <div class={styles.container} ref={(el: HTMLDivElement) => (containerRef = el)}>
      <span class={styles.measurer} ref={(el: HTMLSpanElement) => (measureRef = el)}>
        {props.text}
      </span>
      <span
        class={shouldScroll() ? styles.scrollingText : undefined}
        style={shouldScroll() ? { '--marquee-duration': `${duration()}s` } : undefined}
      >
        {shouldScroll() ? `${props.text}${SEPARATOR}${props.text}${SEPARATOR}` : props.text}
      </span>
    </div>
  );
}

export { MarqueeText };
