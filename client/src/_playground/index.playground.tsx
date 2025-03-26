import { render } from 'solid-js/web';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/fill';
import '../styles.css';
import styles from './styles.playground.module.css';
import { ButtonsPlayground } from './Buttons.playground';

function Showcase() {
  return (
    <div class={styles.componentsPlayground}>
      <h1>Components playground</h1>
      <section class={styles.playgroundSection}>
        <ButtonsPlayground />
      </section>
    </div>
  );
}

render(() => <Showcase />, document.getElementById('root')!);
