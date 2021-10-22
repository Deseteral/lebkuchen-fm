import { Log } from 'lebkuchen-fm-service';
import * as React from 'react';
import LogLine from './LogLine';

interface LogsProps {
  logs: Log[],
}

function Logs({ logs }: LogsProps): JSX.Element {
  return (
    <table>
      <tbody>
        {logs.map((log) => (<LogLine log={log} key={`${log.datetime}${log.message}`} />))}
      </tbody>
    </table>
  );
}

export default Logs;
export { LogsProps };
