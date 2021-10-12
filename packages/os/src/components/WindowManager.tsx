import * as React from 'react';
import { nanoid } from 'nanoid';
import Window from './Window';

type WindowHandle = string;

interface WindowDescriptor {
  handle: WindowHandle,
  title: string,
  backgroundColor?: string,
}

interface OpenWindowOptions {
  title: string,
  backgroundColor?: string,
}

interface WindowManager {
  activeWindows: WindowDescriptor[],
  openWindow: (options: OpenWindowOptions) => Promise<WindowDescriptor>,
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
    openWindow: async (options: OpenWindowOptions) => {
      const descriptor: WindowDescriptor = {
        handle: nanoid(),
        title: options.title,
        backgroundColor: options.backgroundColor,
      };

      setWindows((prevWindows) => [...prevWindows, descriptor]);
      return descriptor;
    },
    focusWindow: (handle: WindowHandle) => {
      const windowIndex = windows.findIndex((descriptor) => (descriptor.handle === handle));

      if (windowIndex < 0) {
        throw new Error(`Window with handle "${handle}" does not exist`);
      }

      const w = [...windows];
      const [focusedWindow] = w.splice(windowIndex, 1);
      setWindows([...w, focusedWindow]);
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
      {windowManager.activeWindows.map((windowDescriptor) => (
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

function getWindowContainer(handle: WindowHandle): (HTMLElement | null) {
  return document.querySelector(`[data-os-window-id="${handle}"]`);
}

function useInit(callback: () => void): void {
  React.useEffect(() => {
    callback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

export { WindowManagerProvider, useWindowManager, WindowRenderer, WindowDescriptor, getWindowContainer, useInit };
