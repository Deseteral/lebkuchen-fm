import styled from 'styled-components';
import css from '../css';

const card = css`
  border: 3px solid #28282e;
  border-radius: 16px;
  background-color: white;
  color: #28282e;
  box-shadow: 4px 4px 0px 0px #28282e;
`;

const Card = styled.div.attrs(() => ({ className: card }))``;

export default Card;
export {
  card,
};
