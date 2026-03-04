import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bestSellers from '../data/best_sellers.json';

gsap.registerPlugin(ScrollTrigger);

export default function SignatureThree() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.spotlight-card');

        cards.forEach((card, i) => {
            const img = card.querySelector('.product-img');

            // Floating reveal from bottom
            gsap.fromTo(card,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Subtle continuous floating motion
            gsap.to(img, {
                y: -15,
                duration: 2 + i * 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            {/* Parallax zoom on scroll - Simplified for Carousel */ }
            gsap.to(img, {
                scale: 1.1,
                scrollTrigger: {
                    trigger: containerRef.current, // Trigger based on section
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-neutral-900 overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Carousel Container */}
                <div className="flex flex-row gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 px-4 -mx-4">
                    {bestSellers.map((item) => (
                        <div key={item.id} className="spotlight-card flex flex-col items-center group w-[85vw] md:w-[400px] snap-center shrink-0">
                            {/* Product Info - Now Above Image */}
                            <div className="text-center space-y-4 mb-8">
                                <span className="product-badge inline-block px-3 py-1 bg-brand-accent/20 border border-brand-accent/30 rounded-full text-[10px] font-bold text-brand-accent uppercase tracking-widest leading-none transition-colors group-hover:bg-brand-accent group-hover:text-white group-hover:border-transparent duration-500">
                                    {item.badge}
                                </span>
                                <h3 className="product-name text-3xl md:text-4xl font-bold text-white tracking-tight leading-none overflow-hidden">
                                    {item.name}
                                </h3>
                            </div>

                            {/* Focused Circular Image */}
                            <div className="relative w-[80%] aspect-square flex items-center justify-center mx-auto transition-transform duration-700 group-hover:scale-[1.02]">
                                {/* Spotlight radial gradient behind */}
                                <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="product-img w-full h-full object-cover rounded-full ring-1 ring-white/10 bg-neutral-800/20 drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)] z-10"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Custom styles
const style = `
.bg-radial-gradient {
    background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 70%);
}
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
`;
if (typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.innerHTML = style;
    document.head.appendChild(s);
}
