'use client';

import { useState, useRef, useEffect } from 'react';

interface GamePlayerProps {
  embedSrc: string;
  title: string;
  pageUrl: string;
  enableProxy: boolean;
}

export default function GamePlayer({ embedSrc, title, pageUrl, enableProxy }: GamePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFullScreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if ((iframeRef.current as any).webkitRequestFullscreen) { /* Safari */
        (iframeRef.current as any).webkitRequestFullscreen();
      } else if ((iframeRef.current as any).msRequestFullscreen) { /* IE11 */
        (iframeRef.current as any).msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => setIsLoading(false);
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-2xl mb-6 bg-black">
      {/* Control bar over the iframe */}
      <div className="absolute z-20 top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleFullScreen}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" />
            </svg>
            Fullscreen
          </button>
          <a
            href={pageUrl || embedSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-200 underline"
          >
            Open in new tab
          </a>
          {enableProxy && (
            <span className="px-2 py-1 text-xs rounded bg-yellow-500 text-black">Proxy</span>
          )}
        </div>
      </div>

      {/* The iframe itself - larger and responsive */}
      <div className="relative" style={{ minHeight: '66vh' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="text-white text-center">
              <svg className="animate-spin h-8 w-8 text-purple-400 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>Loading Game...</p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={embedSrc}
          className={`absolute top-0 left-0 w-full h-full border-0 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          title={title}
          allow="fullscreen; autoplay; accelerometer; gyroscope; picture-in-picture"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}
