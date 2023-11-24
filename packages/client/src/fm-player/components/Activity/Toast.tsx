import * as React from 'react';

interface ToastProps {
  text: string
}

function Toast({ text }: ToastProps) {
  return (
    <div className="max-w-xl rounded-xl shadow-lg bg-gray-700 border-gray-700 text-gray-300 text-sm mb-2" role="alert">
      <div className="flex p-2">
        <div className="font-bold text-gray-200">
          username
        </div>
        <div className="ml-1">
          {text}
        </div>
      </div>
    </div>
  );
}

export { Toast };
