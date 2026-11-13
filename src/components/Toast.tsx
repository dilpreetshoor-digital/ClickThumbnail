"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";

export interface ToastItem {
  id: number;
  type: "success" | "error";
  message: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2.5 rounded border border-line bg-surface px-3.5 py-2.5 text-xs text-ink"
        >
          {t.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-danger" />
          )}
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
            className="text-subtle hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
