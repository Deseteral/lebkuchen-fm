import { Button, ButtonVariant } from '@components/Button/Button';

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
    </>
  );
}

export { ButtonsPlayground };
