import * as React from 'react';
import Window from './Window';
import Desktop from './Desktop';

function App() {
  const [windows, setWindows] = React.useState<string[]>([]);

  React.useEffect(() => {
    setWindows(['1', '2', '3']);
  }, []);

  function onWindowFocus(windowIndex: number): void {
    const w = [...windows];
    const [focusedWindow] = w.splice(windowIndex, 1);
    w.unshift(focusedWindow);
    setWindows(w);
  }

  return (
    <>
      <Desktop />
      {windows.reverse().map((content, index) => (
        <Window
          title="Window"
          onClose={() => {}}
          onFocus={() => onWindowFocus(index)}
          key={content}
        >
          {content}
        </Window>
      ))}
    </>
  );
}

export default App;
