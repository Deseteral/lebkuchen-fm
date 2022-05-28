import { UserData } from 'lebkuchen-fm-service';
import * as React from 'react';
import styled from 'styled-components';
import { Section } from './Section';

const UserName = styled.code<{online: boolean}>`
  color: ${(props) => (props.online ? 'darkgreen' : 'black')};
`;

interface UsersProps {
  loggedInPlayerIds: string[],
  userList: UserData[],
}

function Users({ loggedInPlayerIds, userList }: UsersProps) {
  return (
    <Section header="Users">
      <div>Currently logged in user count: {loggedInPlayerIds.length}</div>
      <ul>
        {userList.map((userData) => (
          <li>
            <UserName online={loggedInPlayerIds.includes(userData.name)}>
              {userData.name}
            </UserName>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { Users, UsersProps };
