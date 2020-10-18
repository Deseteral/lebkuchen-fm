import * as React from 'react';
import io from 'socket.io-client';
import { AdminEventData, Log } from 'lebkuchen-fm-service';
import AppContainer from './AppContainer';
import WsConnections from './WsConnections';
import Logs from './Logs';

interface AdminPanelProps {}
const AdminPanel: React.FunctionComponent<AdminPanelProps> = () => {
  const [loggerHistory, setLoggerHistory] = React.useState<Log[]>([]);
  const [playerIds, setPlayerIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const client = io('/admin');
    client.on('connect', () => console.log('Connected to event stream WebSocket'));

    client.on('admin', (eventData: AdminEventData) => {
      console.log('Received event from event stream', eventData);

      switch (eventData.id) {
        case 'LogEvent':
          setLoggerHistory(eventData.loggerHistory);
          break;

        case 'WsConnectionsEvent':
          setPlayerIds(eventData.playerIds);
          break;

        default:
          break;
      }
    });
  }, []);

  return (
    <AppContainer>
      <Logs logs={loggerHistory} />
      <WsConnections playerIds={playerIds} />
    </AppContainer>
  );
};

export default AdminPanel;
export { AdminPanelProps };
