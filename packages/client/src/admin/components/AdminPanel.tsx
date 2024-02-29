import * as React from 'react';
import io from 'socket.io-client';
import { AdminEventData, Log, UserData } from 'lebkuchen-fm-service';
import { AppContainer } from './AppContainer';
import { Users } from './Users';
import { Logs } from './Logs';
import { getUserList } from '../admin-service';
import { Prompts } from './Prompts';

function AdminPanel() {
  const [loggerHistory, setLoggerHistory] = React.useState<Log[]>([]);
  const [loggedInPlayerIds, setLoggedInPlayerIds] = React.useState<string[]>([]);
  const [userList, setUserList] = React.useState<UserData[]>([]);

  const refreshUserList = () => {
    getUserList().then((users) => setUserList(users));
  };

  React.useEffect(() => {
    refreshUserList();
  }, []);

  React.useEffect(() => {
    const client = io('/api/admin');
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
      <Users
        loggedInPlayerIds={loggedInPlayerIds}
        userList={userList}
        onUserAdded={() => refreshUserList()}
      />
      <Prompts />
    </AppContainer>
  );
}

export { AdminPanel };
