import * as React from 'react';
import io from 'socket.io-client';
import { AdminEventData, Log } from 'lebkuchen-fm-service';
import AppContainer from './AppContainer';
import WsConnections from './WsConnections';
import Logs from './Logs';

interface AdminPanelProps {}
const AdminPanel: React.FunctionComponent<AdminPanelProps> = () => {
  const [loggerHistory, setLoggerHistory] = React.useState<Log[]>([]);

  React.useEffect(() => {
    const client = io('/admin');
    client.on('connect', () => console.log('Connected to event stream WebSocket'));

    client.on('admin', (eventData: AdminEventData) => {
      switch (eventData.id) {
        case 'LogEvent':
          setLoggerHistory(eventData.loggerHistory);
          console.log(eventData.loggerHistory);
          break;

        default:
          break;
      }
    });
  }, []);

  return (
    <AppContainer>
      <WsConnections sockets={[]} />
      <Logs logs={loggerHistory} />
    </AppContainer>
  );
};

export default AdminPanel;
export { AdminPanelProps };
