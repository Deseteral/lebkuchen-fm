import * as React from 'react';
import TestApp from '../apps/test-app/TestApp';

interface AppLibraryProps {

}

function AppLibrary(props: AppLibraryProps): JSX.Element {
  return (
    <TestApp />
  );
}

export default AppLibrary;
export { AppLibraryProps };
