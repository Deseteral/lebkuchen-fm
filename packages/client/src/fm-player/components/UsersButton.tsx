import * as React from 'react';
import { UsersIcon } from '../icons/UsersIcon';
import * as ConnectedUsersService from '../services/connected-users-service';
import { CloseIconSolid } from '../icons/CloseIconSolid';

function UsersButton() {
  const [currentUsers, setCurrentUsers] = React.useState<readonly string[]>([]);
  const [isExtended, setIsExtended] = React.useState<boolean>(false);

  React.useEffect(() => {
    setCurrentUsers(ConnectedUsersService.getUsers());
    ConnectedUsersService.onUsersChange((nextState) => {
      setCurrentUsers(nextState || []);
    });
  }, []);

  const handleClick = () => {
    setIsExtended(!isExtended);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-green-400 rounded-xl p-2 hover:bg-green-600 text-xl font-bold"
    >
      <div>
        <UsersIcon />
        <span>{currentUsers.length}</span>
      </div>
      {isExtended && (
        <ul className="text-base font-normal">
          {currentUsers.map((user) => (
            <li>{user}</li>
          ))}
        </ul>
      )}
    </button>
  );
}
export { UsersButton };
