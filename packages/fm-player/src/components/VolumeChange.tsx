import * as React from 'react';
import styled from 'styled-components';
import * as EventStreamClient from '../services/event-stream-client';

const Button = styled.button`
  color: white;
  background: gray;
  font-size: 16px;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function updateIgnoring(onButtonClickEvent: (() => void), ignored: boolean, text: string) {
  EventStreamClient.setIgnoringVolumeChange(ignored);

  return (
    <>
      <Button onClick={onButtonClickEvent} type="button">
        {text}
      </Button>
    </>
  );
}

function VolumeChange() {
  const [ignored, setIgnoring] = React.useState<boolean>(false);

  return (
    <div>
      {ignored && updateIgnoring(() => setIgnoring(false), false, 'ignore volume change')}
      {!ignored && updateIgnoring(() => setIgnoring(true), true, 'not ignore volume change')}
    </div>
  );
}

export default VolumeChange;
