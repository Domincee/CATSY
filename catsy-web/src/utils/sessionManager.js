import { logger } from './logger';

const SESSION_KEY = 'catsy_session';
const EXPIRY_DAYS = 0.5; // 12 hours — matches Supabase JWT expiry (set to 43200s in dashboard)

/**
 * Decode a JWT without a library and check if it has expired.
 * Returns true when the token's `exp` claim is in the past.
 */
const isJwtExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.exp) return false;
        return Date.now() >= payload.exp * 1000; // exp is Unix seconds
    } catch {
        return false; // malformed token — let the server decide
    }
};

export const saveSession = (user) => {
    try {
        const session = {
            user,
            access_token: user.access_token || user.user?.access_token,
            refresh_token: user.refresh_token || user.user?.refresh_token,
            expiresAt: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        logger.log('Session saved');
    } catch (e) {
        logger.error('Failed to save session', e);
    }
};

export const loadSession = () => {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;

        const session = JSON.parse(raw);

        // 1. Check our own client-side expiry window
        if (!session.expiresAt || Date.now() > session.expiresAt) {
            logger.log('Session window expired, clearing');
            clearSession();
            return null;
        }

        // 2. Check the actual Supabase JWT expiry inside the token
        const token = session.access_token || session.user?.access_token;
        if (token && isJwtExpired(token)) {
            logger.log('Supabase JWT expired, clearing session');
            clearSession();
            // Defer so UserContext's listener has time to register on startup
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('auth-error', {
                    detail: {
                        title: 'Session Expired',
                        message: 'Your session has expired. Please sign in again.',
                        status: 401,
                    }
                }));
            }, 0);
            return null;
        }

        logger.log('Session restored');
        return session.user;
    } catch (e) {
        logger.error('Failed to load session', e);
        clearSession();
        return null;
    }
};

export const getAccessToken = () => {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const session = JSON.parse(raw);
        const token = session.access_token || session.user?.access_token || null;

        // Guard: don't send an expired token to the API
        if (token && isJwtExpired(token)) {
            logger.log('getAccessToken: JWT expired, clearing session');
            clearSession();
            return null;
        }

        return token;
    } catch (e) {
        return null;
    }
};

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    logger.log('Session cleared');
};

