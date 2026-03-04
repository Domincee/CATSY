import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MapPin, ArrowUpRight, X, LocateFixed } from 'lucide-react';
import locationData from '../../data/location.json';

export default function LiveFloorMap({ tablesData, onNavigate }) {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);
    // dynamicData state removed, using props.tablesData

    useGSAP(() => {
        if (isVisible) {
            gsap.to('.map-overlay', {
                x: 0,
                opacity: 1,
                duration: 0.8,
                display: 'block',
                ease: 'power4.out'
            });
        } else {
            gsap.to('.map-overlay', {
                x: 50,
                opacity: 0,
                duration: 0.6,
                display: 'none',
                ease: 'power4.in'
            });
        }
    }, [isVisible]);

    return (
        <section ref={containerRef} id="find-your-spot" className="relative w-full h-[600px] bg-neutral-900 overflow-hidden group">
            {/* Greyscale Map Background (Interactive) */}
            <div className="absolute inset-0 opacity-60 grayscale hover:grayscale-0 transition-all duration-1000">
                <iframe
                    title="Cutsy Coffee Location"
                    src={locationData.embedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    style={{ filter: 'invert(90%) hue-rotate(180deg)' }}
                />
            </div>

            {/* Branded Pin Overlay (Centered - Non-interactive) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative">
                    <div className="absolute -inset-4 bg-brand-accent/30 rounded-full animate-ping" />
                    <div className="relative bg-brand-accent p-3 rounded-full shadow-2xl">
                        <MapPin size={24} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Re-open Button */}
            {!isVisible && (
                <button
                    onClick={() => setIsVisible(true)}
                    className="absolute top-8 right-8 z-20 bg-neutral-900 border border-white/10 p-4 rounded-full text-white hover:bg-brand-accent transition-colors shadow-2xl"
                >
                    <LocateFixed size={20} />
                </button>
            )}

            {/* Sidebar Overlay Card */}
            <div className="container mx-auto px-6 h-full flex items-center justify-end relative pointer-events-none">
                <div className="map-overlay pointer-events-auto w-full max-w-md bg-neutral-900/95 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] space-y-6 relative overflow-hidden">

                    {/* Enhanced Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-6 right-6 z-30 bg-white/10 hover:bg-white text-neutral-400 hover:text-neutral-900 p-2 rounded-full transition-all duration-300"
                    >
                        <X size={18} />
                    </button>

                    {/* Image Gallery (2 Columns) */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {locationData.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group/img">
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent" />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-white text-3xl font-bold tracking-tight">{locationData.title}</h2>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                                    {tablesData.shopStatus}
                                </span>
                            </div>

                            {/* Table Availability Indicator */}
                            <div className="flex items-center gap-2">
                                {tablesData.available > 1 ? (
                                    <>
                                        <span className="w-2 h-2 bg-[#4CAF50] rounded-full shadow-[0_0_8px_rgba(76,175,80,0.4)]" />
                                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                                            ● {tablesData.available}/{tablesData.total} TABLES AVAILABLE
                                        </span>
                                    </>
                                ) : tablesData.available === 1 ? (
                                    <>
                                        <span className="w-2 h-2 bg-[#FF9800] rounded-full animate-[pulse_1.5s_infinite] shadow-[0_0_10px_rgba(255,152,0,0.6)]" />
                                        <span className="text-[11px] font-bold text-[#FF9800] uppercase tracking-widest">
                                            ● ONLY 1 TABLE LEFT
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 bg-[#F44336] rounded-full shadow-[0_0_8px_rgba(244,67,54,0.4)]" />
                                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                                            ● CURRENTLY FULL - CHECK BACK SOON
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-black opacity-40">Address</p>
                        <p className="text-white text-lg font-medium leading-relaxed whitespace-pre-line">
                            {locationData.address}
                        </p>
                    </div>

                    <div className="space-y-3">
                        {/* Primary Action: Reservation */}
                        <button
                            onClick={() => onNavigate('reservation')}
                            className="group flex items-center justify-center w-full text-center bg-white text-neutral-900 px-6 py-4 rounded-full font-bold hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl shadow-white/10"
                        >
                            <span className="tracking-tight uppercase text-center">REserve TAble</span>
                            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>

                        {/* Secondary Action: Google Map */}
                        <button
                            onClick={() => window.open(locationData.directionsUrl, '_blank')}
                            className="flex items-center justify-center w-full bg-white/5 border border-white/10 text-white/70 px-6 py-4 rounded-full font-bold hover:bg-white/10 hover:text-white transition-all duration-300"
                        >
                            <span className="tracking-tight uppercase text-sm">google map</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
