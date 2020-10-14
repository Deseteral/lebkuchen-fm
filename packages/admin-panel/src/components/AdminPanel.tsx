import * as React from 'react';
import AppContainer from './AppContainer';
import WsConnections from './WsConnections';
import Logs from './Logs';

interface AdminPanelProps {}
const AdminPanel: React.FunctionComponent<AdminPanelProps> = () => (
  <AppContainer>
    <WsConnections sockets={[]} />
    <Logs logs={[]} />
  </AppContainer>
);

export default AdminPanel;
export { AdminPanelProps };
