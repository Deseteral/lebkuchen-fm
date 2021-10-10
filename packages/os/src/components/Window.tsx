import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  z-index: 9;
  border: 3px solid #28282e;
  border-radius: 16px;
  background-color: white;
  color: #28282e;
  box-shadow: 4px 4px 0px 0px #28282e;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 2px solid #28282e;
`;

const Header = styled.div`
  cursor: move;
  flex: 1;
  padding: 8px;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;

  font-size: 12px;
  color: #28282e;

  cursor: pointer;

  border: none;
  background: none;
  outline: none;
`;

const ChildrenContainer = styled.div`
  padding-bottom: 8px;
`;

interface WindowProps {
  title: string,
  children: (React.ReactNode | React.ReactNode[]),
  onClose?: () => void,
  onFocus: () => void,
}

function Window({ title, children, onClose, onFocus }: WindowProps): JSX.Element {
  const [posX, setPosX] = React.useState<number>(100);
  const [posY, setPosY] = React.useState<number>(100);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    // TODO: Prevent moving outside viewport bounds
    const onMouseMove = (ev: MouseEvent): void => {
      setPosX(posX - (startX - ev.clientX));
      setPosY(posY - (startY - ev.clientY));
    };

    const onMouseUp = (): void => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const style = {
    left: `${posX}px`,
    top: `${posY}px`,
  };

  return (
    <Container style={style} onMouseDown={() => onFocus()}>
      <HeaderContainer>
        <Header onMouseDown={onMouseDown}>
          {title}
        </Header>
        {onClose && <CloseButton onClick={(): void => onClose()}>X</CloseButton>}
      </HeaderContainer>
      <ChildrenContainer>
        {children}
      </ChildrenContainer>
    </Container>
  );
}

export default Window;
export { WindowProps };
