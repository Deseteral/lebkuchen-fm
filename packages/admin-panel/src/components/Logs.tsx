import { Log } from 'lebkuchen-fm-service';
import * as React from 'react';
import styled from 'styled-components';
import LogLine from './LogLine';
import Section from './Section';

const LogsSection = styled(Section)`
  height: 450px;
  background: white;
  overflow: scroll;
`;

interface LogsProps {
  logs: Log[],
}

const Logs: React.FunctionComponent<LogsProps> = ({ logs }) => (
  <LogsSection>
    <table>
      <tbody>
        {logs.map((log) => (<LogLine log={log} key={`${log.datetime}${log.message}`} />))}
      </tbody>
    </table>
  </LogsSection>
);

export default Logs;
export { LogsProps };
