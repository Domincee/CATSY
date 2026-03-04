import React, { useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';

export default function StatusModal({
    isOpen,
    onClose,
    onConfirm,
    type = 'success',
    title,
    message,
    confirmLabel = "Confirm",
    closeLabel
}) {
    useEffect(() => {
        if (isOpen) {
            // Animate In
            gsap.fromTo("#status-modal-overlay",
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            gsap.fromTo("#status-modal-content",
                { scale: 0.8, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div id="status-modal-overlay" className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div
                id="status-modal-content"
                className="bg-neutral-800 rounded-3xl shadow-2xl p-10 max-w-md w-full relative text-center border border-neutral-700/50 shadow-black/50"
            >
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isSuccess ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {isSuccess ? <Check size={36} strokeWidth={3} /> : <AlertCircle size={36} strokeWidth={3} />}
                </div>

                <h3 className="text-3xl font-bold text-white mb-3">{title}</h3>
                <p className="text-neutral-400 mb-8 leading-relaxed text-lg">{message}</p>

                <div className="flex flex-col gap-4">
                    {onConfirm ? (
                        <>
                            <button
                                onClick={onConfirm}
                                className={`w-full font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl ${isSuccess ? 'bg-green-600 text-white shadow-green-900/20' : 'bg-red-600 text-white shadow-red-900/20'}`}
                            >
                                {confirmLabel}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full bg-neutral-700 text-neutral-300 font-bold py-4 rounded-xl hover:bg-neutral-600 transition-colors"
                            >
                                {closeLabel || "Cancel"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className={`w-full font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl ${isSuccess ? 'bg-neutral-700 text-white hover:bg-neutral-600' : 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/20'}`}
                        >
                            {closeLabel || (isSuccess ? "Continue" : "Try Again")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
