import * as React from 'react';
import SectionHeading from './SectionHeading';

interface WsConnectionsProps {
  sockets: string[],
}

const WsConnections: React.FunctionComponent<WsConnectionsProps> = ({ sockets }) => (
  <section>
    <SectionHeading>WS connections</SectionHeading>
    <div>Current connections: {sockets.length}</div>
    <ul>
      {sockets.map((socketId) => (<li><code>{socketId}</code></li>))}
    </ul>
  </section>
);

export default WsConnections;
export { WsConnectionsProps };
