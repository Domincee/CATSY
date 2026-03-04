import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService';
import { useSSE } from '../hooks/useSSE';
import { logger } from '../utils/logger';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            const data = await settingsService.getSettings();
            setSettings(data);
        } catch (e) {
            logger.error('Failed to fetch settings', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    useSSE({
        'settings.updated': (event) => {
            logger.log('SSE: Settings updated received', event.payload);
            fetchSettings();
        }
    });

    const updateSettings = async (data) => {
        const updated = await settingsService.updateSettings(data);
        setSettings(updated);
        return updated;
    };

    const refreshSettings = () => fetchSettings();

    return (
        <SettingsContext.Provider value={{ settings, isLoading, updateSettings, refreshSettings }}>
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
