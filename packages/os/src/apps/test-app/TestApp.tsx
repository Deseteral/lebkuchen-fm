import * as React from 'react';
import ReactDOM from 'react-dom';

interface TestAppProps {

}

function TestApp(_: TestAppProps): JSX.Element {
  const [yes, setYes] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTimeout(() => setYes(true), 500);
  }, []);

  if (yes) {
    return ReactDOM.createPortal(
      <div>test app</div>,
      document.querySelector('[data-os-window-id="test-app"]') as HTMLElement,
    );
  }

  return null;
}

export default TestApp;
export { TestAppProps };
