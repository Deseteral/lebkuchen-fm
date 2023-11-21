import * as React from 'react';
import { UsersIcon } from '../icons/UsersIcon';
import * as ConnectedUsersService from '../services/connected-users-service';

function UsersButton() {
  const [currentUsers, setCurrentUsers] = React.useState<string[]>([]);

  React.useEffect(() => {
    setCurrentUsers(ConnectedUsersService.getUsers());
    ConnectedUsersService.onUsersChange((nextState) => {
      setCurrentUsers(nextState || []);
    });
  }, []);

  const handleClick = () => {
    console.log(currentUsers);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-green-400 rounded-full p-2 hover:bg-green-600 text-xl font-bold"
    >
      <UsersIcon /> {currentUsers.length}
    </button>
  );
}
export { UsersButton };
