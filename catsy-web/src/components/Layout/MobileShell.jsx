import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import CustomerToast from '../UI/CustomerToast';
import Navbar from './Navbar';

export default function MobileShell({ children, activePage, setActivePage }) {
    const { isLoggedIn, logout } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null });
    const menuRef = useRef(null);
    const containerRef = useRef(null);

    // Morphing Hamburger Logic
    const toggleMenu = () => {
        // setIsMenuOpen(!isMenuOpen); // Disabled to let Navbar handle menu
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
        <div ref={containerRef} className="min-h-screen bg-brand-primary text-brand-secondary font-body overflow-x-hidden relative flex flex-col items-center">
            {/* Full Width Navbar */}
            <Navbar activePage={activePage} onNavigate={setActivePage} />

            {/* Content Area - Conditional Padding for Landing Page */}
            <main className={`w-full max-w-7xl mx-auto min-h-screen ${activePage === 'home' ? '' : 'pt-24 px-6 pb-24'}`}>
                {children}
            </main>

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
    );
}
