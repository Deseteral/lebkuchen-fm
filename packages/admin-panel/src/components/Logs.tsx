import * as React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  height: 450px;
  background: white;
`;

interface LogsProps {
  logs: string[],
}

const Logs: React.FunctionComponent<LogsProps> = ({ logs }) => (
  <Section>
    {logs.map((s) => (<code>{s}</code>))}
  </Section>
);

export default Logs;
export { LogsProps };
