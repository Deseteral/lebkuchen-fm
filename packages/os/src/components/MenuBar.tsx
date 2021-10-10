import * as React from 'react';
import styled from 'styled-components';

const MenuBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: white;
  color: #28282e;
  height: 24px;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  border-bottom: 2px solid #28282e;
  align-items: center;
  padding: 0 8px;
  z-index: 99999;
`;

const LeadingItems = styled.div`
  flex: 1;
`;

const TrailingItems = styled.div`
`;

const timeFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' });

interface MenuBarProps { }

function MenuBar(_: MenuBarProps): JSX.Element {
  const [timeDateText, setTimeDateText] = React.useState<string>('');

  React.useEffect(() => {
    setInterval(() => {
      setTimeDateText(timeFormatter.format(new Date()));
    }, 1000);
  }, []);

  return (
    <MenuBarContainer>
      <LeadingItems>
        <div>Menu</div>
      </LeadingItems>
      <TrailingItems>
        <div>{timeDateText}</div>
      </TrailingItems>
    </MenuBarContainer>
  );
}

export default MenuBar;
export { MenuBarProps };
