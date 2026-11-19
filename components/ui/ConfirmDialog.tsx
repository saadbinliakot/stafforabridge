'use client';

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0e0e0e] border border-[#2e2e2e] rounded-xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
              isDestructive
                ? 'bg-red-950/80 text-red-400 border border-red-700/60'
                : 'bg-neutral-900 text-neutral-300 border border-neutral-700'
            }`}
          >
            {isDestructive ? '⚠' : 'ℹ'}
          </div>
          <div>
            <h4 className="font-display text-base font-bold text-white tracking-tight mb-1">
              {title}
            </h4>
            <p className="font-mono text-xs text-neutral-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222222] font-mono text-xs">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-[#333333] bg-[#161616] text-neutral-300 hover:text-white hover:bg-[#202020] uppercase tracking-wider transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

