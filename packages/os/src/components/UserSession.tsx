import * as React from 'react';
import MenuBar from './MenuBar';
import Window from './Window';
import Desktop from './Desktop';
import TestApp from './TestApp';

interface WindowDescriptor {
  id: string,
  title: string,
}

function UserSession() {
  const [windows, setWindows] = React.useState<WindowDescriptor[]>([]);

  React.useEffect(() => {
    setWindows([{
      id: 'test-app',
      title: 'Test window',
    }]);
  }, []);

  function onWindowFocus(windowIndex: number): void {
    const w = [...windows];
    const [focusedWindow] = w.splice(windowIndex, 1);
    w.unshift(focusedWindow);
    setWindows(w);
  }

  return (
    <>
      <MenuBar />
      <Desktop />
      {windows.reverse().map((windowDescriptor, index) => (
        <Window
          title={windowDescriptor.title}
          onClose={() => {}}
          onFocus={() => onWindowFocus(index)}
          key={windowDescriptor.id}
        >
          <div data-os-window-id={windowDescriptor.id} />
        </Window>
      ))}
      <TestApp />
    </>
  );
}

export default UserSession;
