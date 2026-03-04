import React, { useRef } from 'react';
import { useMenu } from '../../hooks/useMenu';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Heart, ChevronDown, Coffee, Leaf, Zap, Droplets, IceCream, Utensils } from 'lucide-react';

// Icon Map for dynamic icons
const ICONS = {
    Coffee: <Coffee size={18} />,
    Leaf: <Leaf size={18} />,
    Zap: <Zap size={18} />,
    Droplets: <Droplets size={18} />,
    IceCream: <IceCream size={18} />,
    Utensils: <Utensils size={18} />
};

export default function UnifiedMenu() {
    const containerRef = useRef(null);
    const menuListRef = useRef(null);

    // Custom Hook for Menu Logic
    const {
        categories,
        selectedCategory,
        setSelectedCategory,
        isOpen,
        setIsOpen,
        isLoading
    } = useMenu();

    // State for "See All" functionality
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Reset expansion when category changes
    React.useEffect(() => {
        setIsExpanded(false);
    }, [selectedCategory]);

    // Calculate visible items
    const visibleItems = (selectedCategory && selectedCategory.items)
        ? (isExpanded ? selectedCategory.items : selectedCategory.items.slice(0, 5))
        : [];

    const showSeeAllButton = selectedCategory && selectedCategory.items && selectedCategory.items.length > 5;

    // Get icon — use Coffee as default since DB has no iconName
    const CurrentIcon = ICONS.Coffee;

    // Initial load animation - Only run if not loading and container exists
    useGSAP(() => {
        if (isLoading || !containerRef.current) return;

        gsap.from('.menu-header', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
            }
        });
    }, { scope: containerRef, dependencies: [isLoading] });

    // Category switch animation (Cross-fade) - Only run if menu list exists
    useGSAP(() => {
        if (!menuListRef.current) return;

        const tl = gsap.timeline();

        // Phase 1: Fade out old items
        tl.to('.menu-item', {
            opacity: 0,
            x: -10,
            stagger: 0.03,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                // Phase 2: Fade in new items
                gsap.fromTo('.menu-item',
                    { opacity: 0, x: 10 },
                    {
                        opacity: 1,
                        x: 0,
                        stagger: 0.05,
                        duration: 0.5,
                        ease: 'power3.out'
                    }
                );
            }
        });
    }, { scope: menuListRef, dependencies: [selectedCategory, isExpanded] }); // Added isExpanded dependency

    if (isLoading || !selectedCategory) {
        return (
            <section className="py-32 bg-white flex justify-center items-center">
                <div className="animate-spin text-neutral-300"><Coffee size={48} /></div>
            </section>
        );
    }

    return (
        <section ref={containerRef} id="beverage-library" className="py-32 bg-white overflow-hidden relative">
            <div className="container mx-auto px-6 max-w-4xl">

                {/* Category Selector Header */}
                <div className="menu-header mb-20 text-center relative z-10">
                    <p className="text-neutral-400 font-bold text-neutral-400 text-[10px] uppercase tracking-[0.4em] mb-4">Beverage Library</p>

                    <div className="relative inline-block">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="group flex items-center gap-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 px-8 py-5 rounded-full transition-all duration-300"
                        >
                            <span className="text-brand-accent">{CurrentIcon}</span>
                            <span className="text-xl font-bold text-neutral-900 tracking-tight">
                                {isOpen ? "Select your Cup" : selectedCategory.name}
                            </span>
                            <ChevronDown
                                size={20}
                                className={`text-neutral-400 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown List */}
                        {isOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-4 w-64 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-neutral-100 rounded-[2rem] overflow-hidden py-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                {categories.map((choice) => (
                                    <button
                                        key={choice.category_id}
                                        onClick={() => {
                                            setSelectedCategory(choice);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-colors ${selectedCategory.category_id === choice.category_id
                                            ? 'bg-black text-brand-accent text-white'
                                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                            }`}
                                    >
                                        <span className="opacity-50">{ICONS.Coffee}</span>
                                        <span className="font-bold tracking-tight">{choice.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filtered Menu List - Vertical Flow */}
                <div ref={menuListRef} className="flex flex-col gap-y-10 min-h-[400px]">
                    {visibleItems.map((item) => (
                        <div
                            key={item.product_id}
                            className="menu-item group flex justify-between items-end border-b border-neutral-100 pb-3 cursor-pointer relative"
                        >
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                <h4 className="font-bold text-lg text-neutral-900 truncate group-hover:text-brand-accent transition-colors duration-300">
                                    {item.product_name}
                                </h4>
                                {item.product_is_eligible && (
                                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">+1 Stamp</span>
                                )}

                                <div className="flex-1 border-b border-dotted border-neutral-300 mb-1.5 opacity-20" />

                                <Heart
                                    size={16}
                                    className="opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 text-brand-accent absolute -left-6"
                                />
                            </div>

                            <div className="ml-4">
                                <span className="text-neutral-400 font-mono text-sm tracking-tighter">
                                    ₱{item.product_price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* See All Button */}
                {showSeeAllButton && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="px-8 py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 font-bold text-sm rounded-full transition-colors duration-300 flex items-center gap-2"
                        >
                            {isExpanded ? "Show Less" : "See All"}
                            <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                )}

                {/* Decorative background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none text-[20vw] font-black text-neutral-900 leading-none">
                    MENU
                </div>
            </div>
        </section>
    );
}
