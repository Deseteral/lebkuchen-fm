import { render } from 'solid-js/web';
import '../styles.css';
import styles from './styles.playground.module.css';
import { ButtonsPlayground } from './Buttons.playground';

const Showcase = () => (
  <div class={styles.componentsPlayground}>
    <h1>Components playground</h1>
    <section class={styles.playgroundSection}>
      <ButtonsPlayground />
    </section>
  </div>
);

render(() => <Showcase />, document.getElementById('root')!);
