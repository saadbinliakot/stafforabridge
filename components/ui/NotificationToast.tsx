'use client';

import { useEffect } from 'react';

export type NotificationMessage = {
  id?: string;
  type: 'success' | 'error' | 'info';
  message: string;
};

export function NotificationToast({
  notification,
  onClose,
}: {
  notification: NotificationMessage | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!notification) return;
    // Fast auto-dismiss: 2200ms for success, 3500ms for errors/info
    const delay = notification.type === 'success' ? 2200 : 3500;
    const timer = setTimeout(() => {
      onClose();
    }, delay);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100000,
        maxWidth: 'min(360px, calc(100vw - 40px))',
        width: '100%',
        pointerEvents: 'auto',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid ' + (isSuccess ? 'rgba(52, 211, 153, 0.7)' : isError ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.25)'),
          backgroundColor: isSuccess ? 'rgba(8, 22, 14, 0.96)' : isError ? 'rgba(26, 8, 8, 0.96)' : 'rgba(18, 18, 18, 0.96)',
          boxShadow: isSuccess
            ? '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(16, 185, 129, 0.2)'
            : isError
            ? '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(239, 68, 68, 0.2)'
            : '0 8px 30px rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isSuccess ? '#34d399' : isError ? '#f87171' : '#ffffff',
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isSuccess ? '#6ee7b7' : isError ? '#fca5a5' : '#a3a3a3',
                margin: '0 0 2px 0',
              }}
            >
              {isSuccess ? 'Success' : isError ? 'Error' : 'Notice'}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                color: '#ffffff',
                lineHeight: 1.35,
                margin: 0,
                wordBreak: 'break-word',
              }}
            >
              {notification.message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#888888',
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '4px',
            fontSize: '13px',
            lineHeight: 1,
            flexShrink: 0,
            transition: 'color 0.15s ease',
          }}
          className="hover:text-white"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

