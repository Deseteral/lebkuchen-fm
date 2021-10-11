import * as React from 'react';
import MenuBar from './MenuBar';
import Window, { WindowDescriptor } from './Window';
import Desktop from './Desktop';
import AppLibrary from './AppLibrary';

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
      <AppLibrary />
      {windows.reverse().map((windowDescriptor, index) => (
        <Window
          descriptor={windowDescriptor}
          onClose={() => {}}
          onFocus={() => onWindowFocus(index)}
          key={windowDescriptor.id}
        />
      ))}
    </>
  );
}

export default UserSession;
