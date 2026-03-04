import React from 'react';
import HeroSection from '../components/HeroSection';
import SignatureThree from '../components/SignatureThree';
import UnifiedMenu from '../components/Menu/UnifiedMenu';
import LiveFloorMap from '../components/Map/LiveFloorMap';
import { useUser } from '../context/UserContext';

export default function HomePage({ onNavigate, tablesData }) {
    const { isLoggedIn } = useUser();
    return (
        <div className="animate-fade-in bg-white">
            {/* 1. Hero Section (PRESERVED - DO NOT TOUCH) */}
            <div className="relative">
                <HeroSection isLoggedIn={isLoggedIn} onLogin={() => onNavigate('login')} onSignup={() => onNavigate('signup')} onNavigate={onNavigate} />
            </div>

            {/* 2. Signature Three - Floating Spotlight Cards */}
            <SignatureThree />

            {/* 3. Beverage Library - Minimalist Menu */}
            <UnifiedMenu />

            {/* 4. Find Your Spot - Grand Finale Map */}
            <LiveFloorMap tablesData={tablesData} onNavigate={onNavigate} />

            {/* Simplified Footer / Bottom Space */}
            <div className="py-20 bg-neutral-900 border-t border-white/5 text-center">
                <p className="text-neutral-500 text-xs tracking-[0.5em] uppercase">
                    © 2026 Catsy Coffee • Brewed with Passion
                </p>
            </div>
        </div>
    );
}
