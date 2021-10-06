import * as React from 'react';
import styled from 'styled-components';
import App from './App';
import Init from './Init';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const EntryButton = styled.button`
  color: white;
  background: palevioletred;
  font-size: 32px;
  padding: 13px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function EntryScreen() {
  const [activated, setActivated] = React.useState<boolean>(false);

  return (
    <div>
      {activated && <App />}
      {!activated && <Init action={() => setActivated(true)} />}
    </div>
  );
}

export default EntryScreen;
