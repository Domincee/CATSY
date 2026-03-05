import React, { createContext, useContext, useState } from 'react';
import { mockSettings } from '../data/mockSettings';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings] = useState(mockSettings);

    const updateSettings = async (data) => {
        // No-op for static mode or just log it
        console.log('Update settings (Static Mode):', data);
        return { ...settings, ...data };
    };

    const refreshSettings = () => { };

    return (
        <SettingsContext.Provider value={{ settings, isLoading: false, updateSettings, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
