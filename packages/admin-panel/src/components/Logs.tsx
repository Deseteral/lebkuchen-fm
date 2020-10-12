import * as React from 'react';
import styled from 'styled-components';
import Section from './Section';

const LogsSection = styled(Section)`
  height: 450px;
  background: white;
`;

interface LogsProps {
  logs: string[],
}

const Logs: React.FunctionComponent<LogsProps> = ({ logs }) => (
  <LogsSection>
    {logs.map((s) => (<code>{s}</code>))}
  </LogsSection>
);

export default Logs;
export { LogsProps };
