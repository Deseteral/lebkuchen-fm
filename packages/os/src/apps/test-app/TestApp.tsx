import * as React from 'react';
import ReactDOM from 'react-dom';
import LebkuchenSprache from './LebkuchenSprache';
import { getWindowContainer, useInit, useWindowManager, WindowDescriptor } from '../../components/WindowManager';

interface TestAppProps {

}

function TestApp(_: TestAppProps): (JSX.Element | null) {
  const windowManager = useWindowManager();
  const [mainWindowDescriptor, setMainWindowDescriptor] = React.useState<WindowDescriptor | null>(null);

  useInit(async () => {
    const desc = await windowManager.openWindow({
      title: 'Lebkuchen Sparche',
    });
    setMainWindowDescriptor(desc);
  });

  if (!mainWindowDescriptor || !getWindowContainer(mainWindowDescriptor.handle)) return null;

  return ReactDOM.createPortal(
    <LebkuchenSprache />,
    getWindowContainer(mainWindowDescriptor.handle)!,
  );
}

export default TestApp;
export { TestAppProps };
