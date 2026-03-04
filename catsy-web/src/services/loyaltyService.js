import { apiClient } from './api';

/**
 * loyaltyService — Service Layer (SRP)
 * All loyalty-related API calls go through here.
 * Mirrors the pattern of customerService.js.
 */
export const loyaltyService = {
    /**
     * Fetches the customer's full loyalty status:
     * { unspent_count, stamps: [...], rewards: [...] }
     */
    getStatus: () => apiClient('/loyalty/status', { method: 'GET' }),

    /**
     * Claims a reward by trading 9 stamps.
     * Returns the new reward record including coupon_code.
     * @param {string} rewardItem - The drink the customer chose.
     */
    claimReward: (rewardItem) =>
        apiClient('/loyalty/claim', {
            method: 'POST',
            body: JSON.stringify({ reward_item: rewardItem }),
        }),

    /**
     * Staff-only: Redeems a coupon code at the counter.
     * @param {string} couponCode - The 8-char code from the QR scan.
     */
    redeemCoupon: (couponCode) =>
        apiClient('/loyalty/redeem', {
            method: 'POST',
            body: JSON.stringify({ coupon_code: couponCode }),
        }),
};
