import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ProductSection({ product, index }) {
    const container = useRef(null);
    const imageRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        // Parallax Effect
        gsap.to(imageRef.current, {
            yPercent: 20,
            ease: 'none', // Linear for parallax mapping
            scrollTrigger: {
                trigger: container.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Reveal Animation
        gsap.from(textRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out', // Enforce power4.out for entry
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

    }, { scope: container });

    return (
        <section ref={container} className={`min-h-[120vh] w-full flex items-center justify-center relative overflow-hidden ${index % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-800'}`}>

            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between z-10">

                <div className={`flex-1 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div ref={textRef} className="space-y-6">
                        <span className="text-brand-accent uppercase tracking-[0.2em] text-sm">{product.mood} Collection</span>
                        <h2 className="text-5xl md:text-7xl font-bold leading-tight">{product.name}</h2>
                        <button className="px-8 py-3 border border-white/20 rounded-full hover:bg-brand-primary hover:text-black hover:border-transparent transition-all duration-300">
                            DISCOVER
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex justify-center relative h-[80vh]">
                    <img
                        ref={imageRef}
                        src={product.image}
                        alt={product.name}
                        className="object-contain h-full max-w-[120%] drop-shadow-2xl"
                        style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
                    />
                </div>

            </div>

        </section>
    );
}
