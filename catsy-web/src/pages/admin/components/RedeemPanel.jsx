import { useState } from 'react';
import { Search, CheckCircle, AlertTriangle, Loader, Gift } from 'lucide-react';
import { loyaltyService } from '../../../services/loyaltyService';
import { logger } from '../../../utils/logger';

/**
 * RedeemPanel — Presentation + Interaction Layer (SRP)
 * Staff-facing panel for scanning / entering a loyalty coupon code
 * and confirming redemption.
 */
export default function RedeemPanel({ setProcessingMessage }) {
    const [couponCode, setCouponCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);   // { success: true, reward: {...} } | null
    const [error, setError] = useState(null);

    const handleRedeem = async () => {
        const code = couponCode.trim().toUpperCase();
        if (!code) return;

        setIsLoading(true);
        if (setProcessingMessage) setProcessingMessage("Validating Reward Code...");
        setResult(null);
        setError(null);

        try {
            const data = await loyaltyService.redeemCoupon(code);
            logger.log('REDEEM_PANEL: success', data);
            setResult(data);
            setCouponCode('');
        } catch (err) {
            logger.error('REDEEM_PANEL: failed', err);
            setError(err?.message || 'Failed to redeem. Please check the code and try again.');
        } finally {
            setIsLoading(false);
            if (setProcessingMessage) setProcessingMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleRedeem();
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
        setCouponCode('');
    };

    return (
        <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center">
                    <Gift size={24} className="text-brand-accent" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Redeem Loyalty Reward</h2>
                    <p className="text-neutral-400 text-sm">Enter or scan the customer's coupon code.</p>
                </div>
            </div>

            {/* Input Row */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. A1B2C3D4"
                    maxLength={8}
                    className="flex-1 bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 font-mono text-lg tracking-widest px-4 py-3 rounded-xl outline-none focus:border-brand-accent transition-colors"
                />
                <button
                    onClick={handleRedeem}
                    disabled={isLoading || !couponCode.trim()}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isLoading || !couponCode.trim()
                        ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                        : 'bg-brand-accent text-neutral-900 hover:opacity-90'
                        }`}
                >
                    {isLoading
                        ? <Loader size={18} className="animate-spin" />
                        : <Search size={18} />
                    }
                    {isLoading ? 'Checking…' : 'Redeem'}
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex items-start gap-4">
                    <AlertTriangle size={22} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-red-300">Redemption Failed</p>
                        <p className="text-red-400 text-sm mt-1">{error}</p>
                        <button
                            onClick={handleReset}
                            className="mt-3 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                        >
                            Try another code →
                        </button>
                    </div>
                </div>
            )}

            {/* Success State */}
            {result?.success && result.reward && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle size={28} className="text-green-400" />
                        <p className="text-xl font-bold text-green-300">Reward Redeemed!</p>
                    </div>

                    <div className="bg-neutral-800/60 rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-neutral-400">Drink</span>
                            <span className="font-bold text-white">{result.reward.reward_item}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-400">Code</span>
                            <span className="font-mono text-brand-accent tracking-widest">{result.reward.coupon_code}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-400">Status</span>
                            <span className="text-green-400 font-bold uppercase">{result.reward.status}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleReset}
                        className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Redeem Another
                    </button>
                </div>
            )}
        </div>
    );
}
