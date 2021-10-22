import styled from 'styled-components';
import css from '../css';

const menuBarItem = css`
`.onHover`
  color: white;
  background-color: #28282e;
`;

const MenuBarItem = styled.div.attrs(() => ({ className: menuBarItem }));

export default MenuBarItem;
export {
  menuBarItem,
};
