import * as React from 'react';
import { Section } from './Section';

interface WsConnectionsProps {
  playerIds: string[],
}

function WsConnections({ playerIds }: WsConnectionsProps) {
  return (
    <Section header="WS connections">
      <div>Current connections: {playerIds.length}</div>
      <ul>
        {playerIds.map((pid) => (<li><code>{pid}</code></li>))}
      </ul>
    </Section>
  );
}

export { WsConnections, WsConnectionsProps };
