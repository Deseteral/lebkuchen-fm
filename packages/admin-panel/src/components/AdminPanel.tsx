import * as React from 'react';
import io from 'socket.io-client';
import AppContainer from './AppContainer';
import WsConnections from './WsConnections';
import Logs from './Logs';

interface AdminPanelProps {}
const AdminPanel: React.FunctionComponent<AdminPanelProps> = () => {
  React.useEffect(() => {
    const client = io('/admin');
    client.on('connect', () => console.log('Connected to event stream WebSocket'));
  }, []);

  return (
    <AppContainer>
      <WsConnections sockets={[]} />
      <Logs logs={[]} />
    </AppContainer>
  );
};

export default AdminPanel;
export { AdminPanelProps };
