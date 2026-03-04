import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Star, Gift, X, Loader, AlertTriangle, CheckCircle, Coffee } from 'lucide-react';
import MagneticButton from '../components/UI/MagneticButton';
import { useLoyalty } from '../hooks/useLoyalty';
import { useUser } from '../context/UserContext';
import { productService } from '../services/productService';

const TOTAL_STAMPS = 9;

export default function LoyaltyPage() {
    const { isLoggedIn } = useUser();
    const {
        unspentCount,
        rewards,
        isLoading,
        error,
        isClaiming,
        claimError,
        newReward,
        clearNewReward,
        claimReward,
        canClaim,
    } = useLoyalty(isLoggedIn);

    const container = useRef(null);

    // Claim modal state
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState('');
    const [eligibleDrinks, setEligibleDrinks] = useState([]);

    // QR toggle state for stash cards
    const [expandedQr, setExpandedQr] = useState(null);

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const products = await productService.getAllProducts();
                // Extract products flagged as Claimable Rewards
                const availableRewards = products
                    .filter(p => p.product_is_reward)
                    .map(p => p.product_name);
                setEligibleDrinks([...new Set(availableRewards)]);
            } catch (err) {
                console.error("Failed to fetch claimable rewards", err);
            }
        };
        fetchDrinks();
    }, []);

    // Animate stamps on mount / whenever count changes
    useGSAP(() => {
        if (isLoading || !container.current) return;
        gsap.from('.stamp', {
            scale: 0,
            rotation: -45,
            stagger: 0.07,
            duration: 0.7,
            ease: 'elastic.out(1, 0.5)',
        });
    }, { scope: container, dependencies: [unspentCount, isLoading] });

    // ── Claim Flow ───────────────────────────────────────────────
    const handleOpenClaimModal = () => {
        setSelectedDrink(eligibleDrinks.length > 0 ? eligibleDrinks[0] : '');
        setShowClaimModal(true);
    };

    const handleConfirmClaim = async () => {
        if (!selectedDrink) return;
        await claimReward(selectedDrink);
        setShowClaimModal(false);
    };

    // ── Render Guards ────────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center gap-4 animate-fade-in">
                <Coffee size={48} className="text-neutral-300" />
                <p className="text-xl font-bold text-neutral-900">Log in to see your stamps</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 px-6 animate-fade-in pb-32">
                <div className="h-9 w-48 bg-neutral-200 rounded-xl mb-8 animate-pulse" />

                {/* Skeleton stamp card */}
                <div className="bg-neutral-900 p-8 rounded-3xl mb-8">
                    <div className="flex justify-between mb-8">
                        <div className="h-3 w-24 bg-white/10 rounded-full animate-pulse" />
                        <div className="h-3 w-12 bg-white/10 rounded-full animate-pulse" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-full aspect-square rounded-full bg-white/10 animate-pulse" />
                        ))}
                    </div>
                    <div className="h-3 w-48 bg-white/10 rounded-full mx-auto animate-pulse" />
                </div>

                {/* Skeleton rewards section */}
                <div className="h-7 w-32 bg-neutral-200 rounded-xl mb-6 animate-pulse" />
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-100 flex justify-between items-center">
                            <div className="space-y-2">
                                <div className="h-4 w-36 bg-neutral-100 rounded-lg animate-pulse" />
                                <div className="h-3 w-24 bg-neutral-100 rounded-lg animate-pulse" />
                            </div>
                            <div className="h-7 w-16 bg-neutral-100 rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center gap-4 animate-fade-in">
                <AlertTriangle size={40} className="text-red-400" />
                <p className="text-neutral-700 font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div ref={container} className="min-h-screen pt-24 px-6 animate-fade-in pb-32">
            <h1 className="text-4xl font-sans font-bold text-neutral-900 mb-8">My Stamp Card</h1>

            {/* ── Stamp Card ──────────────────────────────────────────── */}
            <div className="bg-neutral-900 text-white p-8 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/20 rounded-full blur-[60px] -mr-10 -mt-20" />

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <span className="font-mono text-sm opacity-50">Catsy Cafe Card</span>
                    <span className="font-mono text-sm opacity-50">{unspentCount}/{TOTAL_STAMPS}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
                    {[...Array(TOTAL_STAMPS)].map((_, i) => (
                        <div
                            key={i}
                            className={`stamp w-full aspect-square rounded-full flex items-center justify-center transition-colors duration-500 overflow-hidden ${i < unspentCount
                                ? 'bg-brand-accent shadow-[0_0_12px_rgba(var(--brand-accent-rgb),0.5)]'
                                : 'bg-white/10'
                                }`}
                        >
                            {/* White circle dims when stamp is not yet earned */}
                            <div className={`w-[80%] h-[80%] rounded-full bg-white flex items-center justify-center overflow-hidden transition-opacity duration-500 ${i < unspentCount ? 'opacity-100' : 'opacity-5'}`}>
                                <img src="/catsy_logo.svg" alt="Catsy" className="w-[80%] h-[80%] object-contain" />
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-center text-sm opacity-70 relative z-10">
                    {unspentCount >= TOTAL_STAMPS
                        ? '🎉 Reward Unlocked! Claim your free drink.'
                        : `${TOTAL_STAMPS - unspentCount} more stamp${TOTAL_STAMPS - unspentCount !== 1 ? 's' : ''} to unlock a free drink`}
                </p>
            </div>

            {/* ── Claim Button ─────────────────────────────────────────── */}
            {canClaim && (
                <MagneticButton
                    onClick={handleOpenClaimModal}
                    className="w-full mb-8 bg-neutral-900 text-white font-bold h-16 rounded-2xl flex items-center justify-center shadow-xl hover:opacity-90 transition-opacity"
                >
                    <span className="flex items-center justify-center gap-2">
                        <Gift size={20} />
                        Claim Free Drink
                    </span>
                </MagneticButton>
            )}

            {/* ── Active Rewards (Your Stash) ──────────────────────────── */}
            <h2 className="text-2xl font-sans font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <Gift size={24} className="text-brand-accent" /> Your Stash
            </h2>

            <div className="space-y-4">
                {rewards.length === 0 && (
                    <div className="p-6 rounded-3xl border-2 border-dashed border-neutral-200 text-center text-neutral-400 text-sm">
                        Keep sipping to earn more!
                    </div>
                )}

                {rewards.map((reward) => {
                    const isActive = reward.status === 'active';
                    const isExpanded = expandedQr === reward.id;
                    return (
                        <div key={reward.id} className="bg-white rounded-3xl border border-neutral-100 overflow-hidden">
                            <div className="p-5 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-neutral-900">{reward.reward_item}</h3>
                                    <p className={`text-xs font-mono mt-1 ${isActive ? 'text-green-600' : 'text-neutral-400'}`}>
                                        {isActive ? `Code: ${reward.coupon_code}` : 'Redeemed'}
                                    </p>
                                </div>
                                <div className="flex items-center flex-col gap-2">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                                        {reward.status}
                                    </div>
                                    {isActive && (
                                        <button
                                            onClick={() => setExpandedQr(reward)}
                                            className="px-3 py-1 rounded-full text-xs font-bold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                                        >
                                            View QR
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Stash QR Overlay ─────────────────────────────────────── */}
            {expandedQr && (
                <div
                    className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
                    onClick={() => setExpandedQr(null)}
                >
                    <div
                        className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center animate-slide-up-fade"
                        onClick={e => e.stopPropagation()}
                    >
                        <p className="font-bold text-xl text-neutral-900 mb-1">{expandedQr.reward_item}</p>
                        <p className="text-neutral-400 text-sm mb-6">Show this QR to staff to redeem</p>
                        <div className="bg-neutral-50 p-4 rounded-2xl inline-block mb-4">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(expandedQr.coupon_code)}`}
                                alt={`QR for ${expandedQr.coupon_code}`}
                                className="w-44 h-44 rounded-xl"
                            />
                        </div>
                        <p className="font-mono text-lg font-bold text-neutral-900 tracking-widest mb-8">
                            {expandedQr.coupon_code}
                        </p>
                        <button
                            onClick={() => setExpandedQr(null)}
                            className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* ── Claim Modal: drink selector ─────────────────────────── */}
            {showClaimModal && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
                    <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up-fade">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900">Choose Your Free Drink</h3>
                                <p className="text-sm text-neutral-500 mt-1">This will use 9 of your stamps.</p>
                            </div>
                            <button onClick={() => setShowClaimModal(false)} className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2 mb-6">
                            {eligibleDrinks.map((drink) => (
                                <button
                                    key={drink}
                                    onClick={() => setSelectedDrink(drink)}
                                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all ${selectedDrink === drink
                                        ? 'bg-neutral-900 text-white'
                                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                                        }`}
                                >
                                    {drink}
                                </button>
                            ))}
                        </div>

                        {claimError && (
                            <p className="text-red-500 text-sm mb-4 text-center">{claimError}</p>
                        )}

                        <button
                            onClick={handleConfirmClaim}
                            disabled={isClaiming || !selectedDrink}
                            className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${isClaiming || !selectedDrink
                                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                : 'bg-neutral-900 text-white hover:bg-black'
                                }`}
                        >
                            {isClaiming ? <Loader size={18} className="animate-spin" /> : <Gift size={18} />}
                            {isClaiming ? 'Processing…' : 'Confirm Claim'}
                        </button>
                    </div>
                </div>
            )}

            {/* ── New Reward QR Modal ──────────────────────────────────── */}
            {newReward && (
                <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center animate-slide-up-fade">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={28} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-1">Reward Claimed! 🎉</h3>
                        <p className="text-neutral-500 text-sm mb-6">{newReward.reward_item}</p>

                        {/* QR Code via free public API — no package needed */}
                        <div className="bg-neutral-50 p-4 rounded-2xl inline-block mb-4">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(newReward.coupon_code)}`}
                                alt={`QR code for ${newReward.coupon_code}`}
                                className="w-44 h-44 rounded-xl"
                            />
                        </div>

                        <p className="font-mono text-lg font-bold text-neutral-900 tracking-widest mb-1">
                            {newReward.coupon_code}
                        </p>
                        <p className="text-xs text-neutral-400 mb-8">Show this QR to the staff to redeem</p>

                        <button
                            onClick={clearNewReward}
                            className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
