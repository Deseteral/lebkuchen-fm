import { UserData } from 'lebkuchen-fm-service';
import * as React from 'react';
import styled from 'styled-components';
import { addNewUser } from '../admin-service';
import { Section } from './Section';

const UserName = styled.code<{ online: boolean }>`
  color: ${(props) => (props.online ? 'darkgreen' : 'black')};
  font-size: 13px;
  margin-left: 8px;
`;

const AddNewUserForm = styled.form`
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
  font-family: sans-serif;
  font-size: 13px;
  outline: none;
`;

const Button = styled.button`
  border: none;
  border-radius: 0;
  min-height: 23px;
  min-width: 75px;
  padding: 0 12px;
  background: silver;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;
  font-family: sans-serif;
  font-size: 13px;

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
  const onAddUserSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const userName = (new FormData(form)).get('userName') as string;

    addNewUser(userName).then(() => {
      onUserAdded();
      form.reset();
    });
  };

  return (
    <Section header="Users">
      <AddNewUserForm onSubmit={onAddUserSubmit}>
        <Input placeholder="Username" name="userName" required />
        <Button type="submit">
          Add user
        </Button>
      </AddNewUserForm>

      <div>Currently logged in users count: {loggedInPlayerIds.length}</div>
      <ul>
        {userList.map((userData) => (
          <li key={userData.name}>
            <UserName online={loggedInPlayerIds.includes(userData.name)}>
              {`> ${userData.name}`}
            </UserName>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export { Users, UsersProps };
