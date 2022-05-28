import * as React from 'react';
import io from 'socket.io-client';
import { AdminEventData, Log, UserData, UsersResponseDto } from 'lebkuchen-fm-service';
import { AppContainer } from './AppContainer';
import { Users } from './Users';
import { Logs } from './Logs';

function AdminPanel() {
  const [loggerHistory, setLoggerHistory] = React.useState<Log[]>([]);
  const [loggedInPlayerIds, setLoggedInPlayerIds] = React.useState<string[]>([]);
  const [userList, setUserList] = React.useState<UserData[]>([]);

  React.useEffect(() => {
    fetch('/users')
      .then((res) => res.json())
      .then((data: UsersResponseDto) => setUserList(data.users));
  }, []);

  React.useEffect(() => {
    const client = io('/admin');
    client.on('connect', () => console.log('Connected to event stream WebSocket'));

    client.on('message', (eventData: AdminEventData) => {
      console.log('Received event from event stream', eventData);

      switch (eventData.id) {
        case 'LogEvent':
          setLoggerHistory(eventData.loggerHistory);
          break;

        case 'WsConnectionsEvent':
          setLoggedInPlayerIds(eventData.playerIds);
          break;

        default:
          break;
      }
    });
  }, []);

  return (
    <AppContainer>
      <Logs logs={loggerHistory} />
      <Users loggedInPlayerIds={loggedInPlayerIds} userList={userList} />
    </AppContainer>
  );
}

export { AdminPanel };
