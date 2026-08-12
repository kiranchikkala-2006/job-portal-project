import React from 'react';

export default function Loader({ fullScreen = true, message = 'Loading...' }) {
  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}
