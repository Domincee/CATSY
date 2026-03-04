import React, { useState, useEffect } from 'react';
import { Coffee } from 'lucide-react';

export default function GlobalCustomerLoading() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleEnd = () => setIsLoading(false);

        window.addEventListener('global-loading-start', handleStart);
        window.addEventListener('global-loading-end', handleEnd);

        return () => {
            window.removeEventListener('global-loading-start', handleStart);
            window.removeEventListener('global-loading-end', handleEnd);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-neutral-900/90 flex flex-col items-center justify-center transition-all duration-300">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
                {/* Inner spinning accent ring */}
                <div className="absolute inset-0 border-4 border-brand-accent rounded-full border-t-transparent animate-spin will-change-transform"></div>
                {/* Central Icon */}
                <Coffee size={32} className="text-brand-accent animate-pulse will-change-transform" />
            </div>
            <p className="mt-8 text-2xl font-bold font-sans text-white animate-pulse tracking-wide will-change-transform">
                Brewing...
            </p>
            <p className="mt-3 text-sm text-neutral-400 font-medium">
                Just a moment please
            </p>
        </div>
    );
}
