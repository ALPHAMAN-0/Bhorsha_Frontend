'use client';

import { type ReactNode, useEffect, useRef } from 'react';

/** A modal built on the native <dialog>: focus trapping and Esc come from the browser. */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[min(30rem,calc(100%-2rem))] rounded-xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/40"
    >
      <div className="space-y-3 px-5 pt-5 pb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {children}
      </div>
      {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">{footer}</div>}
    </dialog>
  );
}
