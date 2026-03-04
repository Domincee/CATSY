import { useState, useEffect, useCallback } from 'react';
import { loyaltyService } from '../services/loyaltyService';
import { logger } from '../utils/logger';

/**
 * useLoyalty — Data Layer Hook (SRP)
 * Owns all server-state for the customer's Loyalty Page.
 * Mirrors the pattern of useProfile.js and useAdminData.js.
 *
 * @param {boolean} isLoggedIn  - From UserContext; skip fetching if not logged in.
 */
export function useLoyalty(isLoggedIn = false) {
    const [unspentCount, setUnspentCount] = useState(0);
    const [stamps, setStamps] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Claiming state ──────────────────────────────────────────────────
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimError, setClaimError] = useState(null);
    const [newReward, setNewReward] = useState(null); // holds the just-created reward

    // ── Load / Refresh ──────────────────────────────────────────────────
    const loadStatus = useCallback(async () => {
        if (!isLoggedIn) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const data = await loyaltyService.getStatus();
            setUnspentCount(data.unspent_count ?? 0);
            setStamps(data.stamps ?? []);
            setRewards(data.rewards ?? []);
        } catch (err) {
            logger.error('useLoyalty: failed to load status', err);
            setError('Could not load your loyalty data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        loadStatus();
    }, [loadStatus]);

    // ── Claim Reward ────────────────────────────────────────────────────
    const claimReward = useCallback(async (rewardItem) => {
        setIsClaiming(true);
        setClaimError(null);
        try {
            const reward = await loyaltyService.claimReward(rewardItem);
            setNewReward(reward);
            // Optimistically refresh so stamp count drops immediately
            await loadStatus();
            return { success: true, reward };
        } catch (err) {
            const msg = err?.message || 'Failed to claim reward. Please try again.';
            logger.error('useLoyalty: claim failed', err);
            setClaimError(msg);
            return { success: false, error: msg };
        } finally {
            setIsClaiming(false);
        }
    }, [loadStatus]);

    const clearNewReward = () => setNewReward(null);

    return {
        // Data
        unspentCount,
        stamps,
        rewards,
        // Status
        isLoading,
        error,
        // Claim
        isClaiming,
        claimError,
        newReward,
        clearNewReward,
        claimReward,
        // Utilities
        canClaim: unspentCount >= 9,
        refreshStatus: loadStatus,
    };
}
