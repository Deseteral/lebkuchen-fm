import { Button, ButtonVariant } from '@components/Button/Button';
import { PhIcon, PhIconType } from '@components/PhIcon/PhIcon';

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
          <PhIcon type={PhIconType.Fill} icon="play" />
        </Button>
      </section>
      <section>
        <p>Icon disabled:</p>
        <Button variant={ButtonVariant.Icon} disabled>
          <PhIcon type={PhIconType.Fill} icon="play" />
        </Button>
      </section>
      <section>
        <p>Icon grouped buttons:</p>
        <div style={{ display: 'flex' }}>
          <Button variant={ButtonVariant.IconGrouped}>
            <PhIcon type={PhIconType.Fill} icon="skip-back" />
          </Button>
          <Button variant={ButtonVariant.IconGrouped}>
            <PhIcon type={PhIconType.Fill} icon="pause" />
          </Button>
          <Button variant={ButtonVariant.IconGrouped}>
            <PhIcon type={PhIconType.Fill} icon="skip-forward" />
          </Button>
        </div>
      </section>
    </>
  );
}

export { ButtonsPlayground };
