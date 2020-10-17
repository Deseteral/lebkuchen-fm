import * as React from 'react';
import Section from './Section';

interface WsConnectionsProps {
  sockets: string[],
}

const WsConnections: React.FunctionComponent<WsConnectionsProps> = ({ sockets }) => (
  <Section header="WS connections">
    <div>Current connections: {sockets.length}</div>
    <ul>
      {sockets.map((socketId) => (<li><code>{socketId}</code></li>))}
    </ul>
  </Section>
);

export default WsConnections;
export { WsConnectionsProps };
