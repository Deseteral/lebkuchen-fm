import { Log } from 'lebkuchen-fm-service';
import * as React from 'react';
import styled from 'styled-components';

const TableRow = styled.tr`
  font-family: monospace;
`;

interface LogLineProps {
  log: Log,
}

const LogLine: React.FunctionComponent<LogLineProps> = ({ log }) => {
  const { datetime, group, level, message } = log;

  return (
    <TableRow>
      <td>{`[${datetime.toLocaleString()}]`}</td>
      <td>{`[${group}]`}</td>
      <td>{`[${level.toUpperCase()}]`}</td>
      <td>{message}</td>
    </TableRow>
  );
};

export default LogLine;
export { LogLineProps };
