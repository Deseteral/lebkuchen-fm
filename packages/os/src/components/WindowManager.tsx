import * as React from 'react';
import Window from './Window';

type WindowHandle = string;

interface WindowDescriptor {
  handle: WindowHandle,
  title: string,
  backgroundColor?: string,
}

interface WindowManager {
  activeWindows: WindowDescriptor[],
  addWindow: (windowDescriptor: WindowDescriptor) => void,
  focusWindow: (handle: WindowHandle) => void,
}

const WindowManagerContext = React.createContext<WindowManager | null>(null);

interface WindowManagerProviderProps {
  children: React.ReactNode,
}

function WindowManagerProvider({ children }: WindowManagerProviderProps) {
  const [windows, setWindows] = React.useState<WindowDescriptor[]>([]);

  const windowManager: WindowManager = React.useMemo(() => ({
    activeWindows: windows,
    addWindow: (windowDescriptor: WindowDescriptor) => {
      setWindows([...windows, windowDescriptor]);
    },
    focusWindow: (handle: WindowHandle) => {
      const windowIndex = windows.findIndex((descriptor) => (descriptor.handle === handle));

      if (windowIndex < 0) {
        throw new Error(`Window with handle "${handle}" does not exist`);
      }

      const w = [...windows];
      const [focusedWindow] = w.splice(windowIndex, 1);
      w.unshift(focusedWindow);

      setWindows(w);
    },
  }), [windows]);

  return (
    <WindowManagerContext.Provider value={windowManager}>
      {children}
    </WindowManagerContext.Provider>
  );
}

function useWindowManager(): WindowManager {
  const context = React.useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
}

function WindowRenderer(): JSX.Element {
  const windowManager = useWindowManager();

  return (
    <>
      {windowManager.activeWindows.reverse().map((windowDescriptor) => (
        <Window
          descriptor={windowDescriptor}
          onClose={() => {}}
          onFocus={() => windowManager.focusWindow(windowDescriptor.handle)}
          key={windowDescriptor.handle}
        />
      ))}
    </>
  );
}

export { WindowManagerProvider, useWindowManager, WindowRenderer, WindowDescriptor };
