import * as React from 'react';

interface WsConnectionsProps {
  sockets: string[],
}

const WsConnections: React.FunctionComponent<WsConnectionsProps> = ({ sockets }) => (
  <section>
    <h2>WS connections</h2>
    <div>Current connections: {sockets.length}</div>
    <ul>
      {sockets.map((socketId) => (<li><code>{socketId}</code></li>))}
    </ul>
  </section>
);

export default WsConnections;
export { WsConnectionsProps };
