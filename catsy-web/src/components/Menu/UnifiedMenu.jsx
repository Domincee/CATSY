import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronDown, Coffee } from 'lucide-react';
import STATIC_MENU from '../../data/menu.json';

// ─── Grid limits ─────────────────────────────────────────────────────────────
// Wide  (≥ 1024px): 3 cols × 6 rows = 18 items max
// Mobile (< 1024px): 2 cols × 6 rows = 12 items maxx
const MAX_ROWS = 6;
const COLS_WIDE = 3;
const COLS_MOBILE = 2;
const LIMIT_WIDE = COLS_WIDE * MAX_ROWS; // 18
const LIMIT_MOBILE = COLS_MOBILE * MAX_ROWS; // 12

// ─── Component ────────────────────────────────────────────────────────────────
export default function UnifiedMenu() {
    const containerRef = useRef(null);
    const gridRef = useRef(null);

    const [selectedCategory, setSelectedCategory] = useState(STATIC_MENU[0]);
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Reset expansion when category changes
    React.useEffect(() => {
        setIsExpanded(false);
    }, [selectedCategory]);

    // ── Derived ──────────────────────────────────────────────────────────────
    const allItems = selectedCategory.items;
    const visibleItems = isExpanded ? allItems : allItems.slice(0, LIMIT_WIDE);
    const showSeeAll = allItems.length > LIMIT_MOBILE;

    // ── Animations ───────────────────────────────────────────────────────────
    useGSAP(() => {
        if (!containerRef.current) return;
        gsap.from('.bev-header', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
            }
        });
    }, { scope: containerRef });

    useGSAP(() => {
        if (!gridRef.current) return;
        const tl = gsap.timeline();
        tl.to('.bev-cell', {
            opacity: 0,
            y: -6,
            stagger: 0.015,
            duration: 0.18,
            ease: 'power2.in',
            onComplete: () => {
                gsap.fromTo('.bev-cell',
                    { opacity: 0, y: 6 },
                    { opacity: 1, y: 0, stagger: 0.025, duration: 0.35, ease: 'power3.out' }
                );
            }
        });
    }, { scope: gridRef, dependencies: [selectedCategory, isExpanded] });

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <section
            ref={containerRef}
            id="beverage-library"
            className="py-24 bg-white overflow-hidden relative"
        >
            <div className="container mx-auto px-6 max-w-5xl">

                {/* ── Header ── */}
                <div className="bev-header mb-12 text-center relative z-10">

                    {/* Section label */}
                    <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-5">
                        Beverage Library
                    </p>

                    {/* Category Dropdown trigger */}
                    <div className="relative inline-block">
                        <button
                            id="bev-category-toggle"
                            onClick={() => setIsOpen(!isOpen)}
                            className="group flex items-center gap-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-8 py-4 rounded-full transition-all duration-300"
                        >
                            <Coffee size={16} className="text-amber-600 shrink-0" />
                            <span className="text-lg font-bold text-neutral-900 tracking-tight">
                                {isOpen ? 'Select your Cup' : selectedCategory.name}
                            </span>
                            <ChevronDown
                                size={18}
                                className={`text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown list */}
                        {isOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-3 w-64 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] border border-neutral-100 rounded-[2rem] overflow-hidden py-3">
                                {STATIC_MENU.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-6 py-3.5 text-left transition-colors ${selectedCategory.id === cat.id
                                            ? 'bg-neutral-900 text-white'
                                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                            }`}
                                    >
                                        <Coffee size={14} className="opacity-40 shrink-0" />
                                        <span className="font-semibold tracking-tight text-sm">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Product Grid ── */}
                {/*
                    Wide  (≥ 1024px): grid-cols-3 → 3 × 6 = 18 items max
                    Mobile (< 1024px): grid-cols-2 → 2 × 6 = 12 items max
                    Items 13–18 are hidden on mobile via `hidden lg:flex`.
                */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0"
                >
                    {visibleItems.map((item, idx) => {
                        const hiddenOnMobile = !isExpanded && idx >= LIMIT_MOBILE;
                        return (
                            <div
                                key={item.id}
                                className={`bev-cell group border-b border-neutral-100 py-3 px-1 transition-colors duration-200 hover:bg-neutral-50/60 ${hiddenOnMobile ? 'hidden lg:flex' : 'flex'
                                    } items-center justify-between gap-3`}
                            >
                                <span className="text-sm font-medium text-neutral-800 truncate flex-1 group-hover:text-amber-700 transition-colors duration-200">
                                    {item.name}
                                </span>
                                <span className="text-sm font-bold text-neutral-400 font-mono shrink-0 tabular-nums">
                                    {item.price}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ── See All / Show Less ── */}
                {showSeeAll && (
                    <div className="mt-8 lg:mt-10 flex justify-center">
                        <button
                            id="bev-see-all-btn"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-7 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 font-bold text-xs uppercase tracking-widest rounded-full border border-neutral-200 transition-all duration-300"
                        >
                            {isExpanded ? 'Show Less' : 'See All'}
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>
                )}

            </div>

            {/* Decorative watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.02] text-[18vw] font-black text-neutral-900 leading-none">
                MENU
            </div>
        </section>
    );
}
