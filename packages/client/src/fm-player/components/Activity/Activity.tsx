import * as React from 'react';
import { Toast } from './Toast';

function Activity() {
  return (
    <div className="p-4 absolute right-0">
      <Toast text="👋 connected" />
      <Toast text="😢 disconnected" />
      <Toast text="🗣️ mówienie" />
      <Toast text="🔊 jeszcze jak" />
      <Toast text="🔊 long long long dfasdf afad as" />
    </div>
  );
}

export { Activity };
