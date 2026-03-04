import { useSettings } from '../context/SettingsContext';

export function useTableAvailability(initialData) {
    const { settings, isLoading } = useSettings();

    if (isLoading || !settings) {
        return initialData;
    }

    return {
        shopStatus: settings.is_open 
            ? `Open Now until ${settings.closing_time?.slice(0, 5) || '10 PM'}` 
            : 'Closed',
        available: settings.available_tables ?? 0,
        total: settings.total_tables ?? 0,
        lastUpdated: new Date().toISOString()
    };
}
