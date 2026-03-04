import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Star, Coffee, Download, X, Maximize2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function IdentityHub({ user }) {
    const cardRef = useRef(null);
    const [showFullScreenQR, setShowFullScreenQR] = useState(false);

    // Guard Clause if user data is not loaded
    if (!user || !user.id) return null; // Or return a Skeleton/Loading state

    // Compute formatted ID (handling camelCase or snake_case, string or number)
    const rawId = user.accountId || user.account_id;
    const formattedId = rawId ? String(rawId).match(/.{1,4}/g)?.join(' ') : '---- ----';

    useGSAP(() => {
        // Glassmorphism shimmer effect or float
        gsap.to(cardRef.current, {
            y: -5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }, { scope: cardRef });

    const handleDownload = () => {
        const canvas = document.getElementById('fullscreen-qr');
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `catsy-qr-${user.id}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <section className="mb-10">
            <h2 className="text-2xl font-sans font-bold mb-4 text-brand-secondary">My Identity</h2>

            {/* Digital QR ID Card */}
            <div ref={cardRef} className="bg-neutral-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-white/10" style={{ backfaceVisibility: 'hidden' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

                <div className="flex justify-between items-start z-10 relative">
                    <div>
                        <p className="text-sm opacity-70 mb-1">Catsy Cafe Account</p>
                        <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
                    </div>

                    {/* Clickable Small QR Code */}
                    <button
                        onClick={() => setShowFullScreenQR(true)}
                        className="bg-white p-2 rounded-xl hover:scale-105 transition-transform cursor-pointer group"
                    >
                        <QRCodeCanvas
                            value={user.id}
                            size={40}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"H"}
                        />
                        <Maximize2 size={12} className="absolute -bottom-1 -right-1 text-white bg-black rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>

                <div className="mt-8">
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Account ID</p>
                    <p className="font-mono text-lg tracking-widest text-white">
                        {formattedId}
                    </p>
                </div>

            </div>


            {/* Fullscreen QR Modal */}
            {showFullScreenQR && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full relative">
                        <button
                            onClick={() => setShowFullScreenQR(false)}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors p-2"
                        >
                            <X size={24} />
                        </button>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-neutral-900 mb-1">{user.firstName} {user.lastName}</h3>
                            <p className="text-neutral-500 text-sm">Scan to verify identity</p>
                        </div>

                        <div className="p-4 border-2 border-neutral-100 rounded-2xl">
                            <QRCodeCanvas
                                id="fullscreen-qr"
                                value={user.id}
                                size={250}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>

                        <p className="font-mono text-lg tracking-widest text-neutral-900 font-bold">
                            {formattedId}
                        </p>

                        <button
                            onClick={handleDownload}
                            className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                        >
                            <Download size={20} />
                            Save Image
                        </button>
                    </div>
                </div>
            )}

        </section>
    );
}
