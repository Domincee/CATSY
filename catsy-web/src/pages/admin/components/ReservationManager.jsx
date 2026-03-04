import React, { useState, useEffect } from 'react';
import { BookOpen, Coffee, Check, X, Clock, AlertTriangle, User, Calendar, Hash, Settings, Table, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { format } from 'date-fns';
import { settingsService } from '../../../services/settingsService';
import { useSettings } from '../../../context/SettingsContext';
import { useSSE } from '../../../hooks/useSSE';

export default function ReservationManager({ reservations, updateReservationState, isLoading, setProcessingMessage }) {

    // --- Restaurant Settings Panel State ---
    const { settings, updateSettings, isLoading: settingsLoading } = useSettings();
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
    const [settingsForm, setSettingsForm] = useState({});
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [isTogglingOpen, setIsTogglingOpen] = useState(false);

    useEffect(() => {
        if (settings) {
            setSettingsForm({
                opening_time: settings.opening_time?.slice(0, 5) ?? '08:00',
                closing_time: settings.closing_time?.slice(0, 5) ?? '22:00',
                total_tables: settings.total_tables,
                available_tables: settings.available_tables,
            });
        }
    }, [settings]);

    const handleSettingsToggle = async () => {
        if (!settings || isTogglingOpen) return;
        setIsTogglingOpen(true);
        try {
            const updated = await updateSettings({ is_open: !settings.is_open });
        } catch (e) {
            console.error('Failed to toggle open/close', e);
        } finally {
            setIsTogglingOpen(false);
        }
    };

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        try {
            const updated = await updateSettings(settingsForm);
            setIsSettingsPanelOpen(false);
        } catch (e) {
            console.error('Failed to save settings', e);
        } finally {
            setIsSavingSettings(false);
        }
    };

    // --- Reservation Status Handlers ---
    const handleStatusChange = async (id, status) => {
        setProcessingMessage(`Updating status to ${status}...`);
        try {
            await updateReservationState(id, status);
        } catch (error) {
            console.error("Failed to update reservation status", error);
        } finally {
            setProcessingMessage('');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'confirmed': return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'completed': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/30';
            default: return 'bg-neutral-800 text-neutral-400 border-neutral-700';
        }
    };

    const pendingReservations = (reservations || []).filter(r => r.status === 'pending');
    const upcomingReservations = (reservations || []).filter(r => r.status === 'confirmed');
    const pastReservations = (reservations || []).filter(r => r.status === 'completed' || r.status === 'cancelled');

    const renderReservationCard = (reservation, isCompact = false) => {
        return (
            <div key={reservation.id} className={`bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-5 transition-all hover:bg-neutral-800/60 shadow-lg flex flex-col justify-between ${isCompact ? 'mb-4' : ''}`}>
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyles(reservation.status)}`}>
                            {reservation.status}
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                            <span className="font-mono">#{reservation.id.slice(0, 6)}</span>
                        </div>
                    </div>

                    <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold text-white mb-2 flex items-center gap-2`}>
                        <User size={isCompact ? 16 : 18} className="text-neutral-300" />
                        {reservation.first_name} {reservation.last_name}
                    </h3>

                    <div className={`space-y-2.5 mt-3 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                        <div className="flex items-center gap-3 text-neutral-300">
                            <Clock size={16} className="text-brand-accent text-white" />
                            <span className="font-medium text-neutral-200">{format(new Date(reservation.reservation_time), isCompact ? "MMM d, h:mm a" : "MMM d, yyyy - h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-3 text-neutral-300">
                            <Calendar size={16} className="text-brand-accent text-white" />
                            <span className="text-neutral-300"><strong className="text-white">{reservation.guest_count}</strong> Guests</span>
                        </div>
                        {reservation.special_requests && !isCompact && (
                            <div className="flex items-start gap-3 bg-neutral-900/50 p-3 rounded-xl mt-3 border border-neutral-800">
                                <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                                <span className="text-neutral-400 italic">"{reservation.special_requests}"</span>
                            </div>
                        )}
                        <div className="pt-2 text-neutral-400 text-[10px]">
                            <span className="text-neutral-400 font-bold uppercase tracking-tighter opacity-70">Phone:</span> <span className="text-neutral-300">{reservation.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-neutral-700/50 flex flex-wrap gap-2">
                    {reservation.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                                className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold py-2 px-3 rounded-xl transition-colors border border-green-500/20 flex items-center justify-center gap-2 text-xs"
                            >
                                <Check size={16} className="text-green-400" /> Confirm
                            </button>
                            <button
                                onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2 px-3 rounded-xl transition-colors border border-red-500/20 flex items-center justify-center gap-2 text-xs"
                            >
                                <X size={16} className="text-red-400" /> Cancel
                            </button>
                        </>
                    )}

                    {reservation.status === 'confirmed' && (
                        <>
                            <button
                                onClick={() => handleStatusChange(reservation.id, 'completed')}
                                className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold py-2 px-3 rounded-xl transition-colors border border-blue-500/20 flex items-center justify-center gap-2 text-xs"
                            >
                                <Check size={16} className="text-blue-400" /> Complete
                            </button>
                            <button
                                onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2 px-3 rounded-xl transition-colors border border-red-500/20 flex items-center justify-center gap-2 text-xs"
                            >
                                <X size={16} className="text-red-400" /> Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Title Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-300 flex items-center gap-3">
                        <BookOpen className="text-brand-accent" />
                        Reservation Dashboard
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1 uppercase tracking-widest font-bold">Real-time floor management</p>
                </div>
            </div>

            {/* === Section 1: Action Required (Pending) - Full Width === */}
            {pendingReservations.length > 0 && (
                <section className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
                        <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse"></span>
                        Action Required ({pendingReservations.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingReservations.map(r => renderReservationCard(r))}
                    </div>
                </section>
            )}

            {/* === Section 2: Main Overview (Settings vs Confirmed) === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Settings and Stats Grid */}
                <div className="flex flex-col gap-6 flex-1">
                    {settings && (
                        <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-6 h-full flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Settings size={20} className="text-brand-accent" /> Store Operational Sync
                                    </h2>
                                    {/* Open / Close Toggle */}
                                    <button
                                        onClick={handleSettingsToggle}
                                        disabled={isTogglingOpen}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors border shadow-sm ${settings.is_open
                                            ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                                            : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                                            } ${isTogglingOpen ? 'opacity-50 cursor-wait' : ''}`}
                                    >
                                        {isTogglingOpen ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            settings.is_open ? <ToggleRight size={20} /> : <ToggleLeft size={20} />
                                        )}
                                        {isTogglingOpen ? 'Updating...' : (settings.is_open ? 'Open' : 'Closed')}
                                    </button>
                                </div>

                                {/* Operational Stats Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Total Tables', value: settings.total_tables, icon: <BookOpen size={16} className="text-neutral-300" /> },
                                        { label: 'Occupied', value: settings.total_tables - settings.available_tables, icon: <Hash size={16} className="text-amber-400" /> },
                                        { label: 'Available', value: settings.available_tables, icon: <Table size={16} className="text-green-400" /> },
                                        { label: 'Floor Status', value: settings.is_open ? 'Active' : 'Offline', icon: <div className={`w-2 h-2 rounded-full ${settings.is_open ? 'bg-green-400' : 'bg-red-400'}`} /> },
                                    ].map(stat => (
                                        <div key={stat.label} className="bg-neutral-900/60 rounded-xl p-4 border border-neutral-800 shadow-inner">
                                            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-neutral-500 mb-1">{stat.icon} {stat.label}</div>
                                            <div className="text-2xl font-black text-white">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Opening', value: settings.opening_time?.slice(0, 5), icon: <Clock size={16} className="text-blue-400" /> },
                                        { label: 'Closing', value: settings.closing_time?.slice(0, 5), icon: <Clock size={16} className="text-blue-400" /> },
                                    ].map(stat => (
                                        <div key={stat.label} className="bg-neutral-800/20 rounded-xl p-3 border border-neutral-700/30 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">{stat.icon} {stat.label}</div>
                                            <div className="text-sm font-bold text-white font-mono">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Edit Settings Footer */}
                            <div className="mt-8 pt-6 border-t border-neutral-700/30">
                                <button
                                    onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
                                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black font-black py-3 rounded-xl transition-all shadow-lg active:scale-95"
                                >
                                    <Settings size={18} className="text-black" />
                                    {isSettingsPanelOpen ? 'Collapse Settings' : 'Expand Advanced Controls'}
                                </button>

                                {isSettingsPanelOpen && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 animate-in slide-in-from-top-2 duration-300">
                                        {[
                                            { key: 'opening_time', label: 'Opening', type: 'time' },
                                            { key: 'closing_time', label: 'Closing', type: 'time' },
                                            { key: 'total_tables', label: 'Capacity', type: 'number' },
                                            { key: 'available_tables', label: 'Available', type: 'number' },
                                        ].map(field => (
                                            <div key={field.key}>
                                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 block">{field.label}</label>
                                                <input
                                                    type={field.type}
                                                    value={settingsForm[field.key] ?? ''}
                                                    onChange={e => setSettingsForm(prev => ({
                                                        ...prev,
                                                        [field.key]: field.type === 'number' ? parseInt(e.target.value, 10) : e.target.value
                                                    }))}
                                                    className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-white text-xs outline-none focus:border-brand-accent transition-colors"
                                                />
                                            </div>
                                        ))}
                                        <div className="sm:col-span-2 mt-4">
                                            <button
                                                onClick={handleSaveSettings}
                                                disabled={isSavingSettings}
                                                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-black py-3 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-green-500/20 active:scale-95"
                                            >
                                                <Save size={16} /> {isSavingSettings ? 'Saving...' : 'Confirm New Config'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Accepted Reservations (Confirmed) */}
                <div className="flex flex-col gap-6 flex-1 max-h-[800px] overflow-visible">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
                        <Check size={20} className="text-green-400" />
                        Accepted & Live ({upcomingReservations.length})
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 min-h-[400px]">
                        {upcomingReservations.length === 0 ? (
                            <div className="h-48 bg-neutral-800/20 rounded-2xl border border-dashed border-neutral-700/50 flex flex-col items-center justify-center text-neutral-500 gap-2">
                                <Calendar size={32} className="text-neutral-600" />
                                <span className="font-bold text-xs tracking-widest uppercase opacity-50">No Active Reservations</span>
                            </div>
                        ) : (
                            upcomingReservations.map(r => renderReservationCard(r, true))
                        )}
                    </div>
                </div>
            </div>

            {/* === Section 3: Past / History - Full Width === */}
            {pastReservations.length > 0 && (
                <section className="space-y-6 pt-10 border-t border-neutral-800/50">
                    <h3 className="text-lg font-bold text-neutral-300 flex items-center gap-2">
                        <Clock size={22} className="text-brand-accent" />
                        Recent History / Archive
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-70 hover:opacity-100 transition-opacity">
                        {pastReservations.map(r => renderReservationCard(r, true))}
                    </div>
                </section>
            )}

            {/* Handle global loading state for list fetch (prop from parent) */}
            {isLoading && !reservations && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-white">
                        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-bold tracking-widest uppercase text-sm">Synchronizing Cloud Data...</span>
                    </div>
                </div>
            )}
        </div>
    );
};
