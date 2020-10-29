/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import * as EventStreamClient from '../services/event-stream-client';

function VolumeChange() {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          onChange={(event) => {
            EventStreamClient.setIgnoringVolumeChange(event.target.checked);
          }}
        />
        ignore volume change
      </label>
    </div>
  );
}

export default VolumeChange;
