import React from 'react';

export default function Hello({ name = 'Fusion' }) {
  return (
    <div className="p-4 bg-magenta/10 rounded">
      <h2 className="text-2xl font-bold text-magenta">Hello from React — {name}</h2>
      <p className="mt-2 text-sm text-gray-700">This page demonstrates Astro + React + Tailwind.</p>
    </div>
  );
}
