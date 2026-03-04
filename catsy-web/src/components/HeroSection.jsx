import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import CatsyLogo from './UI/CatsyLogo/CatsyLogo';
import heroData from '../data/hero.json';
import { useSettings } from '../context/SettingsContext';
import { useSSE } from '../hooks/useSSE';
import { logger } from '../utils/logger';
import { useCallback } from 'react';


gsap.registerPlugin(Flip);

export default function HeroSection({ onLogin, onSignup, onNavigate, isLoggedIn }) {
    const container = useRef(null);
    const logoRef = useRef(null);
    const textContainerRef = useRef(null);
    const btnRef = useRef(null);
    const accountRef = useRef(null);
    const scrollRef = useRef(null);

    // New Refs for Cups
    const leftCupRef = useRef(null);
    const rightCupRef = useRef(null);

    // Asset Configuration Object
    const assets = {
        leftCup: heroData.assets.leftCup,
        rightCup: heroData.assets.rightCup
    };

    const { settings: restaurantSettings } = useSettings();

    // Splash State: true = show splash, false = show hero
    const hasSeenSplash = typeof window !== 'undefined' && sessionStorage.getItem('hasSeenSplash') === 'true';

    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const loadingRef = useRef(false);
    const [shouldStartLogoAnim, setShouldStartLogoAnim] = useState(hasSeenSplash);
    const logoTriggerId = useRef(null);

    useEffect(() => {
        if (hasSeenSplash) return;

        const handleStart = () => {
            loadingRef.current = true;
            setIsGlobalLoading(true);
            if (logoTriggerId.current) clearTimeout(logoTriggerId.current);
        };

        const handleEnd = () => {
            loadingRef.current = false;
            setIsGlobalLoading(false);
            // Wait 0.3s after loading finished before starting logo animation
            logoTriggerId.current = setTimeout(() => {
                setShouldStartLogoAnim(true);
            }, 300);
        };

        window.addEventListener('global-loading-start', handleStart);
        window.addEventListener('global-loading-end', handleEnd);

        // Fallback: If no network request happens within 1s, start anyway
        const fallbackId = setTimeout(() => {
            setShouldStartLogoAnim(old => {
                if (!old && !loadingRef.current) return true;
                return old;
            });
        }, 1000);

        return () => {
            window.removeEventListener('global-loading-start', handleStart);
            window.removeEventListener('global-loading-end', handleEnd);
            // We intentionally DO NOT clear logoTriggerId here to let the 300ms timer survive state transitions
            clearTimeout(fallbackId);
        };
    }, [hasSeenSplash]); // isGlobalLoading removed from dependencies to stabilize timers

    // We start with isSplashComplete = true if seen, else false
    const [isSplashComplete, setIsSplashComplete] = useState(hasSeenSplash);
    // Hero Animation State: true = animation finished, scroll unlocked
    const [isHeroAnimationComplete, setIsHeroAnimationComplete] = useState(hasSeenSplash);
    const layoutState = useRef(null);

    // Conditional Animation Classes
    const animClass = isHeroAnimationComplete ? '' : 'opacity-0 translate-y-8';
    const cupAnimClass = isHeroAnimationComplete ? '' : 'opacity-0';

    useEffect(() => {
        if (isHeroAnimationComplete) {
            window.dispatchEvent(new CustomEvent('hero-reveal-complete'));
        }
    }, [isHeroAnimationComplete]);

    // Lock Scroll during Splash AND Hero Animation
    useEffect(() => {
        if (!isHeroAnimationComplete) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isHeroAnimationComplete]);

    // We no longer trigger the flip automatically based on a timer in useGSAP.
    // Instead we wait for CatsyLogo to call onAnimationComplete.
    const handleLogoAnimationComplete = useCallback(() => {
        if (!isSplashComplete) {
            // 1. Capture State of the logo
            if (logoRef.current) {
                const state = Flip.getState(logoRef.current);
                layoutState.current = state;

                // 2. Change Layout (Trigger Re-render to Hero State)
                sessionStorage.setItem('hasSeenSplash', 'true');
                setIsSplashComplete(true);
            }
        }
    }, [isSplashComplete]);

    useGSAP(() => {
        // useGSAP is kept for scope if needed elsewhere, but splash timer is removed.
    }, { scope: container, dependencies: [isSplashComplete] });

    // FLIP Animation trigger after render updates the DOM
    useLayoutEffect(() => {
        if (isSplashComplete && layoutState.current && logoRef.current) {

            // Animate from the captured state to the new state
            Flip.from(layoutState.current, {
                targets: logoRef.current,
                duration: 1.5,
                ease: "power4.inOut",
                scale: true,
                absolute: true, // Helps with position transitions
                zIndex: 50,
                onComplete: () => {
                    // Reveal Timeline
                    const tl = gsap.timeline({
                        defaults: { ease: "power4.out", duration: 1.8 }
                    });

                    // 1. Words (Staggered)
                    // Note: accessing .word-span via scoped selector might require container ref context if strictly scoped, 
                    tl.to(".word-span", { opacity: 1, y: 0, stagger: 0.4 })
                        .to(".compact-desc", { opacity: 1, y: 0 }, "-=1")
                        .to(".compact-btn", { y: 0 }, "-=-1")
                        .set(".compact-btn", { opacity: 1 }, "-=1")
                        .to(".scroll-indicator", { opacity: 1, y: 0 }, "-=0.5"); // Corrected opacity to 1 as per consistent reveal

                    // 2. Decorative Cups Reveal (Pop Effect)
                    if (leftCupRef.current && rightCupRef.current) {
                        tl.fromTo([leftCupRef.current, rightCupRef.current],
                            {
                                opacity: 0,
                                scale: 0,
                                y: 20
                            },
                            {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                rotation: (i) => i === 0 ? 35 : -50,
                                stagger: 0.15,
                                duration: 1,
                                ease: "back.out(1.7)"
                            }, "-=1.2");
                    }

                    // Unlock Scroll after all animations
                    tl.call(() => setIsHeroAnimationComplete(true));
                }
            });
        }
    }, [isSplashComplete]);


    return (
        <section
            ref={container}
            className={`w-full flex flex-col items-center justify-between text-center px-6 relative overflow-hidden bg-white`}
            style={{ height: '100svh' }}
        >


            {/* Splash Overlay to hide other elements during splash */}
            {!isSplashComplete && (
                <div className="fixed inset-0 bg-white z-0" />
            )}

            {/* Decorative Cups - Isolated Layer */}
            <div className={`absolute inset-0 pointer-events-none overflow-hidden z-10 ${!isSplashComplete ? 'hidden' : 'block'}`}>
                <img
                    ref={leftCupRef}
                    src={assets.leftCup}
                    className={`absolute top-[100px] -left-[80px] w-[200px] cup-atmospheric`}
                    alt="Decorative Coffee"
                    style={{ transform: 'rotate(35deg)', opacity: 0 }}
                />
                <img
                    ref={rightCupRef}
                    src={assets.rightCup}
                    className={`absolute top-[230px] -right-[80px] w-[200px] cup-atmospheric`}
                    alt="Decorative Coffee"
                    style={{ transform: 'rotate(-50deg)', opacity: 0 }}
                />
            </div>

            {/* Top Spacer */}
            <div className={`flex-1 max-h-24 compact-spacer transition-opacity duration-500 ${!isSplashComplete ? 'opacity-0' : 'opacity-100'}`}></div>

            {/* Main Content Container */}
            {/* During splash, this centering logic applies to the fixed overlay if we used one, but here we toggle classes */}
            <div className={`
                flex flex-col items-center justify-center 
                ${!isSplashComplete ? 'fixed inset-0 z-50' : 'flex-grow z-10 w-full max-w-[320px]'}
            `}>

                {/* Animated Logo */}
                {/* data-flip-id is crucial for Flip to track the same element */}
                <div
                    ref={logoRef}
                    data-flip-id="catsy-logo"
                    className={`
                        flip-logo compact-logo transition-opacity duration-700
                        ${!isSplashComplete ? 'w-80 h-80' : 'w-45 h-45 md:w-40 md:h-40 mb-6'}
                        ${!shouldStartLogoAnim && !isSplashComplete ? 'opacity-0' : 'opacity-100'}
                    `}
                >
                    <div className="w-full h-full">
                        <CatsyLogo
                            shouldStart={shouldStartLogoAnim}
                            onAnimationComplete={handleLogoAnimationComplete}
                        />
                    </div>
                </div>

                {/* Text Content - Reveal sequence */}
                <div
                    ref={textContainerRef}
                    className={`
                        mb-8 md:mb-12 shrink-0 compact-text-container 
                        ${!isSplashComplete ? 'hidden' : 'block'}
                    `}
                >
                    <h1 className="text-2xl md:text-4xl font-sans font-bold text-neutral-900 mb-2 leading-tight compact-text whitespace-nowrap">
                        {heroData.title.split(" ").map((word, i) => (
                            <span key={i} className={`word-span inline-block mr-2 text-brand-accent ${animClass}`}>
                                {word}
                            </span>
                        ))}
                    </h1>
                    <p className={`compact-desc text-neutral-500 text-base md:text-lg mt-2 ${animClass}`}>
                        {heroData.description}
                    </p>
                </div>

                <div
                    className={`
                        w-full flex flex-col items-center gap-4 compact-gap
                        ${!isSplashComplete ? 'hidden' : 'flex'}
                    `}
                >
                    <button
                        ref={btnRef}
                        onClick={isLoggedIn ? () => onNavigate('profile') : onLogin}
                        className={`compact-btn w-full bg-neutral-900 text-white py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 duration-500 active:scale-95 transition-all ${animClass}`}
                    >
                        {isLoggedIn ? "Profile" : heroData.primaryButton}
                    </button>

                    {/* Secondary: Reserve a Table */}
                    <button
                        onClick={() => onNavigate('reservation')}
                        className={`compact-btn w-full bg-transparent border-2 border-neutral-900 text-neutral-900 py-4 rounded-full font-bold text-lg hover:bg-neutral-50 transition-colors duration-300 ${animClass}`}
                    >
                        Reserve a Table
                    </button>

                    {/* Status Badge */}
                    <div className={`mt-2 flex items-center justify-center gap-2 ${animClass} transition-all duration-700`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${restaurantSettings?.is_open ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'}`}></div>
                        <span className={`text-sm font-bold tracking-widest uppercase ${restaurantSettings?.is_open ? 'text-green-600' : 'text-red-600'}`}>
                            {restaurantSettings ? (restaurantSettings.is_open ? 'Open Now' : 'Closed for now') : 'Checking...'}
                        </span>
                    </div>


                </div>
            </div>

            {/* Bottom Spacer */}
            <div className="flex-1 compact-spacer"></div>

            {/* Scroll Indicator */}
            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-0 w-full flex justify-center z-20 pointer-events-none">
                <div
                    ref={scrollRef}
                    className={`scroll-indicator ${animClass}`}
                >
                    <div className="flex flex-col items-center gap-2 animate-bounce">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 whitespace-nowrap">{heroData.scrollText}</span>
                        <div className="w-px h-8 bg-neutral-300"></div>
                    </div>
                </div>
            </div>

        </section>
    );
}
