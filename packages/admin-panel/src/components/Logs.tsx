import { Log } from 'lebkuchen-fm-service';
import * as React from 'react';
import styled from 'styled-components';
import Section from './Section';

const LogsSection = styled(Section)`
  height: 450px;
  background: white;
`;

interface LogsProps {
  logs: Log[],
}

const Logs: React.FunctionComponent<LogsProps> = ({ logs }) => (
  <LogsSection>
    {logs.map((log) => (<code>{log.message}</code>))}
  </LogsSection>
);

export default Logs;
export { LogsProps };
