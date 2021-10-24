import * as React from 'react';
import io from 'socket.io-client';
import { AdminEventData, Log } from 'lebkuchen-fm-service';
import LogLine from './LogLine';

interface LogConsolePanelProps {}

function LogConsolePanel(_: LogConsolePanelProps): JSX.Element {
  const [loggerHistory, setLoggerHistory] = React.useState<Log[]>([]);

  React.useEffect(() => {
    const client = io('/admin');
    client.on('connect', () => console.log('Connected to event stream WebSocket'));

    client.on('message', (eventData: AdminEventData) => {
      console.log('Received event from event stream', eventData);

      switch (eventData.id) {
        case 'LogEvent':
          setLoggerHistory(eventData.loggerHistory);
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <table>
      <tbody>
        {loggerHistory.map((log) => (<LogLine log={log} key={`${log.datetime}${log.message}`} />))}
      </tbody>
    </table>
  );
}

export default LogConsolePanel;
export { LogConsolePanelProps };
