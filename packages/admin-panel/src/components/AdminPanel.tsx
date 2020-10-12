import * as React from 'react';
import Panel from './Panel';
import WsConnections from './WsConnections';
import Logs from './Logs';

interface AdminPanelProps {}
const AdminPanel: React.FunctionComponent<AdminPanelProps> = () => (
  <Panel>
    <WsConnections sockets={[]} />
    <Logs logs={[]} />
  </Panel>
);

export default AdminPanel;
export { AdminPanelProps };
