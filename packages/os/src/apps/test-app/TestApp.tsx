import * as React from 'react';
import ReactDOM from 'react-dom';
import { getWindowContainer, useInit, useWindowManager, WindowDescriptor } from '../../components/WindowManager';

interface TestAppProps {

}

function TestApp(_: TestAppProps): (JSX.Element | null) {
  const windowManager = useWindowManager();
  const [mainWindowDescriptor, setMainWindowDescriptor] = React.useState<WindowDescriptor | null>(null);

  useInit(async () => {
    const desc = await windowManager.openWindow({
      title: 'Lebkuchexplorer',
    });
    setMainWindowDescriptor(desc);
  });

  if (!mainWindowDescriptor || !getWindowContainer(mainWindowDescriptor.handle)) return null;

  return ReactDOM.createPortal(
    <div>Im inside a window</div>,
    getWindowContainer(mainWindowDescriptor.handle)!,
  );
}

export default TestApp;
export { TestAppProps };
