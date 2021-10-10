import * as React from 'react';
import styled from 'styled-components';

const Background = styled.div`
  background-color: #fff7e4;
  width: 100vw;
  height: 100vh;
`;

interface DesktopProps { }

function Desktop(_: DesktopProps): JSX.Element {
  return (
    <Background />
  );
}

export default Desktop;
export { DesktopProps };
