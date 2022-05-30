import { UserData, AddUserRequestDto } from 'lebkuchen-fm-service';
import * as React from 'react';
import styled from 'styled-components';
import { Section } from './Section';

const UserName = styled.code<{online: boolean}>`
  color: ${(props) => (props.online ? 'darkgreen' : 'black')};
`;

const AddNewUserRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

const Input = styled.input`
  margin-right: 8px;
  appearance: none;
  border: none;
  border-radius: 0;
  height: 21px;
  background-color: #fff;
  box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
  padding: 3px 4px;
`;

const Button = styled.button`
  border: none;
  border-radius: 0;
  min-height: 23px;
  min-width: 75px;
  padding: 0 12px;
  background: silver;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;

  &:active {
    box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey;
    padding: 2px 11px 0 13px;
  }
`;

interface UsersProps {
  loggedInPlayerIds: string[],
  userList: UserData[],
  onUserAdded: (() => void),
}

function Users({ loggedInPlayerIds, userList, onUserAdded }: UsersProps) {
  const [addUserName, setAddUserName] = React.useState<string>('');

  const addNewUser = () => {
    const data: AddUserRequestDto = { username: addUserName };
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('/users', options).then(() => {
      onUserAdded();
      setAddUserName('');
    });
  };

  return (
    <Section header="Users">
      <AddNewUserRow>
        <Input
          value={addUserName}
          onChange={(e) => setAddUserName(e.target.value)}
          placeholder="Username"
        />
        <Button onClick={() => addNewUser()}>
          Add user
        </Button>
      </AddNewUserRow>

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
