import { Log } from 'lebkuchen-fm-service';
import * as React from 'react';
import styled from 'styled-components';
import LogLine from './LogLine';
import SectionHeading from './SectionHeading';

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

const Logs: React.FunctionComponent<LogsProps> = ({ logs }) => (
  <section>
    <SectionHeading>Logs</SectionHeading>
    <Container>
      <table>
        <tbody>
          {logs.map((log) => (<LogLine log={log} key={`${log.datetime}${log.message}`} />))}
          {logs.map((log) => (<LogLine log={log} key={`${log.datetime}${log.message}`} />))}
        </tbody>
      </table>
    </Container>
  </section>
);

export default Logs;
export { LogsProps };
