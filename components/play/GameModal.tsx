'use client';

import { useState, useEffect, useRef } from 'react';
import { Game } from '@/lib/constants';

interface GameModalProps {
  game: Game;
  children: React.ReactNode;
}

export default function GameModal({ game, children }: GameModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC handler
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setClosing(true);
        setTimeout(() => {
          setIsOpen(false);
          setClosing(false);
        }, 200);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // When modal opens, save trigger and move focus to close button
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      // small timeout to ensure element exists in DOM
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 0);
    } else {
      // when fully closed, restore focus to trigger
      if (triggerRef.current) {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
    }
  }, [isOpen]);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
    }, 200);
  }

  // Focus trap inside the modal panel
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!e.shiftKey && document.activeElement === last) {
      // tab from last goes to first
      e.preventDefault();
      first.focus();
    }

    if (e.shiftKey && document.activeElement === first) {
      // shift+tab from first goes to last
      e.preventDefault();
      last.focus();
    }
  }

  if (!isOpen) {
    return <div onClick={open}>{children}</div>;
  }

  return (
    <>
      <div onClick={open}>{children}</div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${
          closing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={close}
        aria-hidden={false}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Play ${game.title}`}
          ref={panelRef}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          className={`relative w-full max-w-6xl h-[90vh] bg-slate-900 rounded-xl overflow-hidden transform transition-all duration-200 ${
            closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            ref={closeBtnRef}
            onClick={close}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
            aria-label="Close game"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <iframe
            src={game.gameUrl}
            title={game.title}
            className="w-full h-full"
            allowFullScreen
            allow="gamepad; microphone; camera"
          />
        </div>
      </div>
    </>
  );
}
