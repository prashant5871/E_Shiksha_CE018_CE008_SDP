import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="w-16 h-16 bg-red-500 rounded-full animate-ping"></div>
    </div>
  );
}
