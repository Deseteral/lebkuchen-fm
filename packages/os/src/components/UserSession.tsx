import * as React from 'react';
import { WindowManagerProvider, WindowRenderer } from './WindowManager';
import MenuBar from './MenuBar';
import Desktop from './Desktop';
import AppLibrary from './AppLibrary';

function UserSession() {
  return (
    <WindowManagerProvider>
      <MenuBar />
      <Desktop />
      <AppLibrary />
      <WindowRenderer />
    </WindowManagerProvider>
  );
}

export default UserSession;
