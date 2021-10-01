import * as React from 'react';
import Section from './Section';

interface WsConnectionsProps {
  playerIds: string[],
}

const WsConnections: React.FunctionComponent<WsConnectionsProps> = ({ playerIds }) => (
  <Section header="WS connections">
    <div>Current connections: {playerIds.length}</div>
    <ul>
      {playerIds.map((pid) => (<li><code>{pid}</code></li>))}
    </ul>
  </Section>
);

export default WsConnections;
export { WsConnectionsProps };
