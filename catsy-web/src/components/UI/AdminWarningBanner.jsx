import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';

export default function AdminWarningBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-600 text-white px-4 py-2 flex items-center justify-center gap-3 shadow-lg">
            <ShieldAlert size={18} className="shrink-0" />
            <span className="text-sm font-medium">
                You're logged in as an admin. Some customer features may be limited.
            </span>
            <button
                onClick={() => setIsVisible(false)}
                className="ml-2 p-1 hover:bg-amber-700 rounded transition-colors"
                aria-label="Dismiss"
            >
                <X size={16} />
            </button>
        </div>
    );
}
