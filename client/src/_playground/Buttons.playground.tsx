import { Button, ButtonVariant } from '@components/Button/Button';
import playIcon from '../icons/play-icon.png';

function ButtonsPlayground() {
  return (
    <>
      <h2>Button</h2>
      <section>
        <p>Primary (Default):</p>
        <Button>Click me</Button>
      </section>
      <section>
        <p>Full width:</p>
        <Button fullWidth>Click me</Button>
      </section>
      <section>
        <p>Disabled:</p>
        <Button disabled>Click me</Button>
      </section>
      <section>
        <p>Secondary:</p>
        <Button variant={ButtonVariant.Secondary}>Click me</Button>
      </section>
      <section>
        <p>Secondary + disabled:</p>
        <Button variant={ButtonVariant.Secondary} disabled>
          Click me
        </Button>
      </section>
      <section>
        <p>Underlined:</p>
        <Button variant={ButtonVariant.Underlined}>Click me</Button>
      </section>
      <section>
        <p>Underlined + disabled:</p>
        <Button variant={ButtonVariant.Underlined} disabled>
          Click me
        </Button>
      </section>
      <section>
        <p>Icon:</p>
        <Button variant={ButtonVariant.Icon}>
          <img src={playIcon} alt="" />
        </Button>
      </section>
      <section>
        <p>Icon disabled:</p>
        <Button variant={ButtonVariant.Icon} disabled>
          <img src={playIcon} alt="" />
        </Button>
      </section>
      <section>
        <p>Icon grouped buttons:</p>
        <div style={{ display: 'flex' }}>
          <Button variant={ButtonVariant.IconGrouped}>
            <img src={playIcon} alt="" />
          </Button>
          <Button variant={ButtonVariant.IconGrouped}>
            <img src={playIcon} alt="" />
          </Button>
          <Button variant={ButtonVariant.IconGrouped}>
            <img src={playIcon} alt="" />
          </Button>
        </div>
      </section>
    </>
  );
}

export { ButtonsPlayground };
