import React from 'react';
import { mockSettings } from '../data/mockSettings';

/**
 * StoreInfoSection component
 * Displays store address, operating hours, table availability, and a Google Maps embed.
 */
const StoreInfoSection = () => {
    // Hardcoded data as per requirements
    const storeInfo = {
        address: "1495 Manuel B. Suaybaguio Sr. St, Tagum, Davao del Norte",
        tablesAvailable: 8,
        // Using the specific Google Maps embed for the new address
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.061965244661!2d125.81176879999998!3d7.4583974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f953422af99a7f%3A0x6e72d179d6f83a5c!2s1495%20Manuel%20B.%20Suaybaguio%20Sr.%20St%2C%20Tagum%2C%20Davao%20del%20Norte!5e0!3m2!1sen!2sph!4v1772736093524!5m2!1sen!2sph"
    };

    return (
        <section id="location" className="py-24 bg-neutral-900 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Map */}
                    <div className="relative group overflow-hidden rounded-2xl border border-white/10 aspect-video lg:aspect-square">
                        <iframe
                            title="Store Location"
                            src={storeInfo.mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            className="grayscale contrast-125 opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                        ></iframe>
                        <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl"></div>
                    </div>

                    {/* Right Column: Information */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-light text-white mb-6 uppercase tracking-widest">
                                Visit Our <span className="font-bold text-amber-500">Sanctuary</span>
                            </h2>
                            <p className="text-neutral-400 text-lg leading-relaxed max-w-md">
                                Experience the finest coffee in the heart of the city. A space designed for focus, connection, and craft.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Address */}
                            <div className="space-y-2">
                                <h3 className="text-white text-xs uppercase tracking-[0.3em] font-medium opacity-50">Address</h3>
                                <p className="text-neutral-300 font-light">{storeInfo.address}</p>
                            </div>

                            {/* Operating Hours */}
                            <div className="space-y-2">
                                <h3 className="text-white text-xs uppercase tracking-[0.3em] font-medium opacity-50">Hours</h3>
                                <p className="text-neutral-300 font-light">
                                    Mon - Sun: {mockSettings.opening_time} - {mockSettings.closing_time}
                                </p>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-tighter ${mockSettings.is_open ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {mockSettings.is_open ? 'Open Now' : 'Closed'}
                                </span>
                            </div>

                            {/* Table Count */}
                            <div className="space-y-2">
                                <h3 className="text-white text-xs uppercase tracking-[0.3em] font-medium opacity-50">Capacity</h3>
                                <p className="text-neutral-300 font-light">{storeInfo.tablesAvailable} Artisan Tables Available</p>
                            </div>
                        </div>

                        {/* Social / Contact Shortcut */}
                        <div className="pt-8 border-t border-white/5">
                            <p className="text-neutral-500 text-sm italic">
                                "Every cup tells a story, and every table has a view."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StoreInfoSection;
