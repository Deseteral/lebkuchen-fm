import * as React from 'react';
import styled from 'styled-components';
import { Log } from 'lebkuchen-fm-service';
import { LogLine } from './LogLine';
import { Section } from './Section';

const Container = styled.div`
  border: 2px solid;
  border-style: inset;
  padding: 8px;
  margin: 8px;
  height: 450px;
  background: white;
  overflow: scroll;
`;

interface LogsProps {
  logs: Log[],
}

function Logs({ logs }: LogsProps) {
  return (
    <Section header="Logs">
      <Container>
        <table>
          <tbody>
            {logs.map((log) => (<LogLine log={log} key={`${log.datetime}${log.message}`} />))}
          </tbody>
        </table>
      </Container>
    </Section>
  );
}

export { Logs, LogsProps };
