'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Something went wrong!</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        We apologize for the inconvenience. Our team has been notified of the issue.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-6 py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
