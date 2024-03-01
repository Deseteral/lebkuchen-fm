import { RefObject, createContext, useContext } from 'react';

interface WindowContextProps {
  windows: {
    id: string;
    ref: RefObject<HTMLDivElement>;
  }[];
  cleanWindow: (UUID: string) => void;
}

let windows: WindowContextProps['windows'] = [];

function cleanWindow(UUID: string) {
  windows = windows.filter((win) => win.id !== UUID);
}

const WindowsContext = createContext<WindowContextProps>({ windows, cleanWindow });

function useWindowsContext(): WindowContextProps {
  return useContext(WindowsContext);
}

export { WindowsContext, useWindowsContext };
