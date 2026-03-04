import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import CustomerToast from '../UI/CustomerToast';

export default function MobileShell({ children, activePage, setActivePage }) {
    const { isLoggedIn, logout } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null });
    const menuRef = useRef(null);
    const containerRef = useRef(null);

    // Morphing Hamburger Logic
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogoutClick = () => {
        setStatusModal({
            isOpen: true,
            type: 'error',
            title: 'Sign Out',
            message: 'Are you sure you want to sign out?',
            confirmLabel: 'Sign Out',
            onConfirm: confirmLogout
        });
    };

    const confirmLogout = () => {
        setStatusModal({
            isOpen: true,
            type: 'success',
            title: 'Signed Out',
            message: 'You have been successfully signed out.'
        });

        setTimeout(() => {
            logout();
            setActivePage('home');
            toggleMenu();
            setStatusModal(prev => ({ ...prev, isOpen: false }));
        }, 1000); // 1 second delay for success UI
    };

    // Scroll to Top on Page Change & Refresh
    useEffect(() => {
        // Disable browser's default scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Force scroll to top
        window.scrollTo(0, 0);
    }, [activePage]);

    useGSAP(() => {
        if (isMenuOpen) {
            gsap.to(menuRef.current, {
                x: 0,
                duration: 0.5,
                ease: 'power4.out',
            });
        } else {
            // Using pixels instead of % to ensure it translates exactly 430px (or the container width) out of frame.
            gsap.to(menuRef.current, {
                x: '150%',
                duration: 0.5,
                ease: 'power4.in',
            });
        }
    }, [isMenuOpen]);



    const [isSplashActive, setIsSplashActive] = useState(() => {
        return typeof window !== 'undefined' && sessionStorage.getItem('hasSeenSplash') !== 'true';
    });

    useEffect(() => {
        const handleRevealComplete = () => setIsSplashActive(false);
        window.addEventListener('hero-reveal-complete', handleRevealComplete);
        return () => window.removeEventListener('hero-reveal-complete', handleRevealComplete);
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-brand-primary text-brand-secondary font-body overflow-x-hidden relative flex justify-center">
            {/* Mobile Container Limit */}
            <div className="w-full max-w-[430px] bg-white min-h-screen shadow-2xl relative">

                {/* Header */}
                <header className={`
                    fixed top-0 w-full max-w-[430px] z-[100] flex items-center justify-between p-6 bg-white/90 backdrop-blur-md text-neutral-900
                    transition-opacity duration-1000
                    ${(isSplashActive && activePage === 'home') ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}>
                    <div className="flex flex-col leading-none select-none cursor-pointer" onClick={() => activePage !== 'home' && setActivePage && setActivePage('home')}>
                        <div className="font-catsy  text-2xl tracking-tight text-neutral-900 uppercase">
                            CATSY
                        </div>
                        <div className="font-coffee text-[22px] font-semibold text-neutral-500  uppercase">
                            COFFEE
                        </div>
                    </div>
                    <button onClick={toggleMenu} className="focus:outline-none z-50 text-neutral-900">
                        {/* Simple Morph Icon Placeholder (Lucide Swap) */}
                        {isMenuOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
                    </button>
                </header>

                {/* Content Area - Conditional Padding for Landing Page */}
                <main className={`min-h-screen ${activePage === 'home' ? '' : 'pt-24 px-6 pb-24'}`}>
                    {children}
                </main>

                {/* Navigation Drawer Wrapper for Clipping */}
                <div className="fixed inset-y-0 right-0 left-0 w-full max-w-[430px] mx-auto z-40 pointer-events-none overflow-hidden">
                    {/* Navigation Drawer Inner */}
                    <div ref={menuRef} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] pointer-events-auto" style={{ transform: 'translateX(100%)' }}>

                        {/* Decorative Background Logos - Absolute to stick to the mobile container bounds */}
                        <img src="/catsy_logo_white.svg" alt="" className="absolute top-28 -right-16 w-56 h-56 pointer-events-none select-none opacity-90 z-0" />
                        <img src="/catsy_logo_white.svg" alt="" className="absolute bottom-8 -left-16 w-56 h-56 pointer-events-none select-none opacity-90 z-0" />

                        <div className="flex flex-col items-center justify-center space-y-8 relative z-10 w-full mt-10">
                            {!isLoggedIn ? (
                                <>
                                    <button onClick={() => { setActivePage('login'); toggleMenu(); }} className={`nav-link-animated font-sans text-4xl font-bold transition-colors ${activePage === 'login' ? 'text-white nav-link-animated-active' : 'text-white/60'}`}>Login</button>
                                    <button onClick={() => { setActivePage('home'); toggleMenu(); }} className={`nav-link-animated font-sans text-4xl font-bold transition-colors ${activePage === 'home' ? 'text-white nav-link-animated-active' : 'text-white/60'}`}>Home</button>
                                    <button onClick={() => { setActivePage('reservation'); toggleMenu(); }} className={`nav-link-animated font-sans text-4xl font-bold transition-colors ${activePage === 'reservation' ? 'text-white nav-link-animated-active' : 'text-white/60'}`}>Reservation</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { setActivePage('home'); toggleMenu(); }} className={`nav-link-animated font-sans text-4xl font-bold transition-colors ${activePage === 'home' ? 'text-white nav-link-animated-active' : 'text-white/60'}`}>Home</button>
                                    <button onClick={() => { setActivePage('profile'); toggleMenu(); }} className={`nav-link-animated font-sans text-4xl font-bold transition-colors ${activePage === 'profile' ? 'text-white nav-link-animated-active' : 'text-white/60'}`}>Profile</button>
                                    <button onClick={() => { setActivePage('reservation'); toggleMenu(); }} className={`nav-link-animated font-sans text-4xl font-bold transition-colors ${activePage === 'reservation' ? 'text-white nav-link-animated-active' : 'text-white/60'}`}>Reservations</button>
                                    <button onClick={() => { setActivePage('loyalty'); toggleMenu(); }} className={`nav-link-animated font-sans text-4xl font-bold transition-colors ${activePage === 'loyalty' ? 'text-white nav-link-animated-active' : 'text-white/60'}`}>Loyalty</button>
                                    <button onClick={handleLogoutClick} className="nav-link-animated text-white font-sans text-2xl font-bold mt-8">Sign Out</button>
                                </>
                            )}
                        </div>
                    </div>

                </div>

                <CustomerToast
                    isOpen={statusModal.isOpen}
                    onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
                    type={statusModal.type}
                    title={statusModal.title}
                    message={statusModal.message}
                    onConfirm={statusModal.onConfirm}
                    confirmLabel={statusModal.confirmLabel}
                />

            </div>
        </div>
    );
}
