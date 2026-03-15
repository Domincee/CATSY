import React, { createContext, useContext, useState } from 'react';
import { mockAuth } from '../data/mockAuth';

import { mockUser } from '../data/mockUser';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userInfo, setUserInfo] = useState({
        id: "mock-123",
        ...mockUser,
        favoriteItem: "Caramel Macchiato",
        history: []
    });
    const [isLoggedIn, setIsLoggedIn] = useState(mockAuth.isLoggedIn);
    const [isInitialized, setIsInitialized] = useState(true);

    const login = (userData) => {
        setUserInfo(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        setUserInfo(null);
        setIsLoggedIn(false);
    };

    const saveSession = (updates) => {
        setUserInfo(prev => ({ ...prev, ...updates }));
    };

    const confirmDeactivation = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <UserContext.Provider value={{
            userInfo,
            isLoggedIn,
            isDeactivated: false,
            authError: { title: '', message: '' },
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
