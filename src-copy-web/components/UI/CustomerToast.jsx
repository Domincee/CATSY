import React, { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';
import { gsap } from 'gsap';

/**
 * CustomerToast — a bottom-sheet notification that fits the customer portal theme.
 * Replaces StatusModal for all customer-facing pages.
 * Admin pages continue to use StatusModal.
 *
 * Props:
 *   isOpen        bool
 *   onClose       fn
 *   onConfirm     fn   (optional — shows confirm + cancel buttons)
 *   type          'success' | 'error' | 'warning'
 *   title         string
 *   message       string
 *   confirmLabel  string  (default: 'Confirm')
 *   closeLabel    string  (default: 'Dismiss' / 'Cancel')
 */
export default function CustomerToast({
    isOpen,
    onClose,
    onConfirm,
    type = 'success',
    title,
    message,
    confirmLabel = 'Confirm',
    closeLabel,
}) {
    const overlayRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        if (isOpen && overlayRef.current && cardRef.current) {
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.25, ease: 'power2.out' }
            );
            gsap.fromTo(cardRef.current,
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const configMap = {
        success: {
            icon: <CheckCircle2 size={28} strokeWidth={2} />,
            iconBg: 'bg-emerald-50 text-emerald-600',
            accent: 'bg-emerald-600',
            accentText: 'text-white',
            accentHover: 'hover:bg-emerald-700',
            bar: 'bg-emerald-500',
        },
        error: {
            icon: <XCircle size={28} strokeWidth={2} />,
            iconBg: 'bg-neutral-100 text-neutral-600',
            accent: 'bg-neutral-900',
            accentText: 'text-white',
            accentHover: 'hover:bg-neutral-800',
            bar: 'bg-neutral-300',
        },
        warning: {
            icon: <AlertTriangle size={28} strokeWidth={2} />,
            iconBg: 'bg-amber-50 text-amber-500',
            accent: 'bg-neutral-900',
            accentText: 'text-white',
            accentHover: 'hover:bg-neutral-800',
            bar: 'bg-amber-400',
        },
    };
    const config = configMap[type] || configMap.success;

    const defaultClose = onConfirm
        ? (closeLabel || 'Cancel')
        : (closeLabel || 'Dismiss');

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center sm:p-6 bg-black/30 backdrop-blur-[2px]"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                ref={cardRef}
                className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden"
            >
                {/* Colour accent bar at top */}
                <div className={`h-1 w-full ${config.bar}`} />

                <div className="p-6">
                    {/* Header row */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
                            {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-neutral-900 text-lg leading-tight">{title}</p>
                            <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{message}</p>
                        </div>
                        {/* Close X (only when no confirm button) */}
                        {!onConfirm && (
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors shrink-0"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-5">
                        {onConfirm ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-2xl font-bold text-sm bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors active:scale-95"
                                >
                                    {defaultClose}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 py-3 rounded-2xl font-bold text-sm ${config.accent} ${config.accentText} ${config.accentHover} transition-colors active:scale-95 shadow-sm`}
                                >
                                    {confirmLabel}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className={`w-full py-3 rounded-2xl font-bold text-sm ${config.accent} ${config.accentText} ${config.accentHover} transition-colors active:scale-95 shadow-sm`}
                            >
                                {defaultClose}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
