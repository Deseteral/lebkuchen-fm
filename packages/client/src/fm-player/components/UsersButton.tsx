import * as React from 'react';
import { UsersIcon } from '../icons/UsersIcon';
import * as ConnectedUsersService from '../services/connected-users-service';

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
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="absolute bg-green-400 rounded-xl p-3 hover:bg-green-600 text-2xl font-bold leading-none"
      >
        <div className="flex">
          <UsersIcon />
          <span className="pl-1">{currentUsers.length}</span>
        </div>
        {isExtended && (
        <ul className="text-base font-normal leading-normal pt-1">
          {currentUsers.map((user) => (
            <li className="whitespace-nowrap" key={user}>{user}</li>
          ))}
        </ul>
        )}
      </button>
    </div>

  );
}
export { UsersButton };
