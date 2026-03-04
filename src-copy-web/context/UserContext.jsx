import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadSession, saveSession as persistSession, clearSession as removeSession } from '../utils/sessionManager';
import { logger } from '../utils/logger';
import { validateSessionWithServer } from '../utils/sessionValidator';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDeactivated, setIsDeactivated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [authError, setAuthError] = useState({ title: '', message: '' });

    useEffect(() => {
        const handleAuthError = (e) => {
            logger.log('Global Auth Error detected:', e.detail?.message);
            setAuthError({
                title: e.detail?.title || "Session Expired",
                message: e.detail?.message || "Your session has ended. Please sign in again."
            });
            setIsDeactivated(true);
        };
        window.addEventListener('auth-error', handleAuthError);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const currentUser = loadSession();
                if (currentUser) {
                    logger.log('Tab visible: re-validating session...');
                    handleSessionValidation(currentUser);
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const savedUser = loadSession();
        if (savedUser) {
            setUserInfo(savedUser);
            setIsLoggedIn(true);
            handleSessionValidation(savedUser);
        }
        setIsInitialized(true);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('auth-error', handleAuthError);
        };
    }, []);

    const handleSessionValidation = async (user) => {
        const result = await validateSessionWithServer(user);
        if (result.success) {
            setUserInfo(result.user);
            persistSession(result.user);
        } else {
            setAuthError(result.error);
            setIsDeactivated(true);
        }
    };

    const login = (userData) => {
        persistSession(userData);
        setUserInfo(userData);
        setIsLoggedIn(true);
        setIsDeactivated(false);
    };

    const logout = () => {
        removeSession();
        setUserInfo(null);
        setIsLoggedIn(false);
        setIsDeactivated(false);
    };

    const saveSession = (updates) => {
        const newUser = { ...userInfo, ...updates };
        persistSession(newUser);
        setUserInfo(newUser);
    };

    const confirmDeactivation = () => {
        logout();
        if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin';
        } else {
            window.location.href = '/';
        }
    };

    return (
        <UserContext.Provider value={{
            userInfo,
            isLoggedIn,
            isDeactivated,
            authError,
            isInitialized,
            login,
            logout,
            saveSession,
            confirmDeactivation,
            setUserInfo,
            setIsLoggedIn
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
