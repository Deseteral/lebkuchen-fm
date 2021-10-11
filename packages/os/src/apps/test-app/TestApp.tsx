import * as React from 'react';
import { useWindowManager } from '../../components/WindowManager';

interface TestAppProps {

}

function TestApp(_: TestAppProps): (JSX.Element | null) {
  const windowManager = useWindowManager();

  React.useEffect(() => {
    windowManager.addWindow({
      handle: 'test-app',
      title: 'Test window',
      backgroundColor: '#f98284',
    });
  }, []);

  return null;
}

export default TestApp;
export { TestAppProps };
