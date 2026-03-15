import React, { useState, useEffect, useCallback } from 'react';
import MagneticButton from '../components/UI/MagneticButton';
import { ArrowLeft, Check, User, Calendar, Users, MessageSquare, AlertTriangle } from 'lucide-react';
import { logger } from '../utils/logger';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import { reservationService } from '../services/reservationService';
import { settingsService } from '../services/settingsService';
import CustomerToast from '../components/UI/CustomerToast';
import { useSSE } from '../hooks/useSSE';

export default function ReservationPage({ onLoginReq, tablesData }) {
    const { isLoggedIn, userInfo } = useUser();
    const { settings: restaurantSettings, isLoading: settingsLoading } = useSettings();
    // Mock User Data - REPLACED with userInfo prop
    // const user = isLoggedIn ? { ... } : null;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        date: '',
        guests: 2,
        request: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const [submittedReservation, setSubmittedReservation] = useState(null);

    // Today's date in YYYY-MM-DD, used as min for the date input
    const todayStr = new Date().toISOString().split('T')[0];

    // Fetch active reservation if logged in
    const fetchActiveReservation = useCallback(async () => {
        if (isLoggedIn) {
            try {
                const reservations = await reservationService.getMyReservations();
                // Show ONLY active reservations (pending, confirmed).
                // If it's cancelled, rejected, or completed, it goes to history,
                // and the user sees the booking form again.
                const active = reservations.find(r => ['pending', 'confirmed'].includes(r.status));
                setSubmittedReservation(active || null);
            } catch (error) {
                logger.error("Failed to fetch user reservations", error);
            }
        }
    }, [isLoggedIn]);

    useEffect(() => {
        fetchActiveReservation();
    }, [fetchActiveReservation]);

    // Listen for SSE events: re-fetch when admin updates a reservation
    useSSE({
        'reservation.updated': fetchActiveReservation,
    });

    // Auto-fill logic
    useEffect(() => {
        if (isLoggedIn && userInfo) {
            setFormData(prev => ({
                ...prev,
                firstName: userInfo.firstName || '',
                lastName: userInfo.lastName || '',
                email: userInfo.email || '',
                phone: userInfo.phone || ''
            }));
        } else {
            // Reset personal fields if logged out
            setFormData(prev => ({
                ...prev,
                firstName: '',
                lastName: '',
                email: '',
                phone: ''
            }));
        }
    }, [isLoggedIn, userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            // Keep only numbers and limit to 11 digits
            const cleanValue = value.replace(/\D/g, '').slice(0, 11);
            setFormData(prev => ({ ...prev, [name]: cleanValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation check
        if (!formData.date || !formData.guests) return;

        // Block TODAY if restaurant is manually toggled closed
        const selectedDate = new Date(formData.date).toISOString().split('T')[0];
        if (restaurantSettings && !restaurantSettings.is_open && selectedDate === todayStr) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Closed Today',
                message: 'Sorry, we are closed for today. Please feel free to select a future date for your reservation!'
            });
            return;
        }

        // Show confirmation modal
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Reservation details',
            message: `Please confirm your reservation for ${formData.guests} people on ${new Date(formData.date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`,
            onConfirm: executeSubmit
        });
    };

    const executeSubmit = async () => {
        if (isLoading) return; // Double-click protection

        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setIsLoading(true);

        const payload = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email || null,
            phone: formData.phone,
            reservation_time: new Date(formData.date).toISOString(),
            guest_count: parseInt(formData.guests, 10),
            special_requests: formData.request || null
        };

        try {
            const result = await reservationService.createReservation(payload);
            setSubmittedReservation(result);
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Request Sent',
                message: `Thank you, ${formData.firstName}! Your reservation request has been submitted. We will notify you once confirmed.`
            });
            // Keep form data around in case they want to book another or just leave it out of sight
        } catch (error) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Reservation Failed',
                message: error.message || 'There was an issue processing your reservation. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 pt-24 animate-fade-in flex flex-col items-center">

            {/* Header Content */}
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-4 px-6">
                <h1 className="text-4xl md:text-5xl font-sans font-bold text-white">
                    Secure Your Spot
                </h1>
                <p className="text-neutral-400 text-lg">
                    Reserve a table at Catsy Coffee and enjoy premium brews in a relaxing atmosphere.
                </p>

                {/* Availability Badge */}
                <div className="inline-flex items-center gap-3 bg-neutral-800/50 border border-white/5 px-5 py-2 rounded-full backdrop-blur-md">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-sm font-bold text-white tracking-wide uppercase">
                        5 Tables Currently Available
                    </span>
                </div>
            </div>

            {/* Smart Form Container - Full Width & Vertical */}
            <div className="w-full bg-white rounded-t-3xl shadow-2xl flex flex-col flex-1 overflow-hidden">

                {/* Context / Info - Full Width (Hide on success) */}
                {!submittedReservation && (
                    <div className="w-full bg-neutral-100 p-8 pt-10 flex flex-col relative overflow-hidden shrink-0">
                        <div className="relative z-10 space-y-4 max-w-xl mx-auto w-full">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-neutral-900">Reservation Details</h3>
                                {!isLoggedIn && (
                                    <button
                                        onClick={onLoginReq}
                                        className="text-sm font-bold text-brand-accent hover:text-brand-accent/80 underline"
                                    >
                                        Log in for auto-fill
                                    </button>
                                )}
                            </div>
                            <p className="text-neutral-500 text-sm">Please review your booking details before confirming.</p>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                {submittedReservation ? (
                    <div className="flex-1 p-8 pb-32 flex flex-col items-center text-center bg-white">

                        {/* Status Icon & Header */}
                        {submittedReservation.status === 'confirmed' ? (
                            <>
                                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                                        <Check size={32} className="text-white" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Reservation Confirmed!</h2>
                                <p className="text-neutral-500 mb-8 max-w-sm">
                                    Your reservation has been successfully booked. We look forward to serving you!
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6">
                                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                                        <Calendar size={32} className="text-white" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Waiting for Confirmation</h2>
                                <p className="text-neutral-500 mb-8 max-w-sm">
                                    Your request has been received. Please wait while our staff reviews and confirms your booking.
                                </p>
                            </>
                        )}


                        <div className="w-full max-w-md bg-neutral-50 p-6 rounded-3xl border border-neutral-200 text-left space-y-4">
                            <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
                                <span className="text-sm font-medium text-neutral-500">Status</span>
                                <span className={`px-3 py-1 bg-opacity-10 rounded-full text-xs font-bold uppercase tracking-wider
                                    ${submittedReservation.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        ['cancelled', 'rejected'].includes(submittedReservation.status) ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {submittedReservation.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-sm text-neutral-500">Name</span>
                                <span className="font-bold text-neutral-900">{submittedReservation.first_name} {submittedReservation.last_name}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-sm text-neutral-500">Contact</span>
                                <div className="text-right">
                                    <div className="font-bold text-neutral-900">{submittedReservation.phone}</div>
                                    {submittedReservation.email && <div className="text-xs text-neutral-500">{submittedReservation.email}</div>}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-sm text-neutral-500">Date & Time</span>
                                <span className="font-bold text-neutral-900">
                                    {new Date(submittedReservation.reservation_time).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-sm text-neutral-500">Guests</span>
                                <span className="font-bold text-neutral-900">{submittedReservation.guest_count} People</span>
                            </div>
                            {submittedReservation.special_requests && (
                                <div className="flex flex-col pt-2 border-t border-neutral-100">
                                    <span className="text-sm text-neutral-500 mb-1">Special Request</span>
                                    <span className="text-sm italic text-neutral-900">{submittedReservation.special_requests}</span>
                                </div>
                            )}
                        </div>

                        {/* Remove the redundant 'Book a Table' button because we only show this UI for active reservations now */}
                    </div>
                ) : (
                    <div className="flex-1 p-8 pb-32 relative">
                        {/* Custom Loading Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center">
                                <div className="relative w-20 h-20 flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-neutral-200 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-brand-accent rounded-full border-t-transparent animate-spin"></div>
                                    <Calendar size={24} className="text-brand-accent animate-pulse" />
                                </div>
                                <p className="mt-6 text-xl font-bold text-neutral-900 animate-pulse">Securing your table...</p>
                                <p className="mt-2 text-sm text-neutral-500">Please do not refresh the page.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto relative">

                            {/* Closed Banner */}
                            {restaurantSettings && !restaurantSettings.is_open && (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-2">
                                    <AlertTriangle size={20} className="shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm">We're Closed Today</p>
                                        <p className="text-xs mt-0.5">We are not accepting any more reservations for today, but you can still book for future dates!</p>
                                    </div>
                                </div>
                            )}

                            {/* No longer disabling the entire fieldset - allowing future bookings */}
                            <fieldset className="space-y-8">

                                {/* Personal Details Section */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-2">
                                        <User size={14} /> Personal Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-neutral-900 ml-1">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                readOnly={isLoggedIn}
                                                className={`w-full p-4 bg-neutral-50 rounded-2xl font-medium outline-none border focus:border-brand-accent transition-all ${isLoggedIn ? 'text-neutral-500 cursor-not-allowed border-transparent' : 'border-neutral-200 text-neutral-900'}`}
                                                placeholder="e.g. John"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-neutral-900 ml-1">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                readOnly={isLoggedIn}
                                                className={`w-full p-4 bg-neutral-50 rounded-2xl font-medium outline-none border focus:border-brand-accent transition-all ${isLoggedIn ? 'text-neutral-500 cursor-not-allowed border-transparent' : 'border-neutral-200 text-neutral-900'}`}
                                                placeholder="e.g. Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-neutral-900 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                readOnly={isLoggedIn}
                                                className={`w-full p-4 bg-neutral-50 rounded-2xl font-medium outline-none border focus:border-brand-accent transition-all ${isLoggedIn ? 'text-neutral-500 cursor-not-allowed border-transparent' : 'border-neutral-200 text-neutral-900'}`}
                                                placeholder="e.g. coffee@catsy.com"
                                                required={!isLoggedIn}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-neutral-900 ml-1">Contact Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                readOnly={isLoggedIn}
                                                className={`w-full p-4 bg-neutral-50 rounded-2xl font-medium outline-none border focus:border-brand-accent transition-all ${isLoggedIn ? 'text-neutral-500 cursor-not-allowed border-transparent' : 'border-neutral-200 text-neutral-900'}`}
                                                placeholder="e.g. 09123456789"
                                                maxLength={11}
                                                pattern="[0-9]{11}"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-neutral-100" />

                                {/* Booking Details Section */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider flex items-center gap-2">
                                        <Calendar size={14} /> Booking Details
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-neutral-900 ml-1">Date &amp; Time</label>
                                            {restaurantSettings && (
                                                <p className="text-xs text-neutral-400 ml-1">
                                                    Available: {restaurantSettings.opening_time?.slice(0, 5)} – {restaurantSettings.closing_time?.slice(0, 5)}
                                                </p>
                                            )}
                                            <input
                                                type="datetime-local"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                min={`${todayStr}T${restaurantSettings?.opening_time?.slice(0, 5) ?? '00:00'}`}
                                                max={restaurantSettings ? undefined : undefined}
                                                className="w-full p-4 bg-neutral-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent text-neutral-900"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-neutral-900 ml-1">Guests</label>
                                            <div className="relative">
                                                <select
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={handleChange}
                                                    className="w-full p-4 bg-neutral-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-brand-accent appearance-none text-neutral-900"
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} People</option>)}
                                                </select>
                                                <Users size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-neutral-900 ml-1">Special Request (Optional)</label>
                                        <textarea
                                            name="request"
                                            value={formData.request}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-neutral-50 rounded-2xl font-medium outline-none border border-neutral-200 focus:border-brand-accent transition-all h-24 resize-none text-neutral-900"
                                            placeholder="e.g. Near the window, high chair needed..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <MagneticButton
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full text-white py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 px-8 ${isLoading ? 'bg-neutral-500 cursor-wait' : 'bg-neutral-900 group'}`}
                                    >
                                        <span>{isLoading ? 'Processing...' : 'Confirm Reservation'}</span>
                                        {!isLoading && (
                                            <div className="bg-white/10 p-1 rounded-full group-hover:bg-brand-accent group-hover:text-black transition-colors flex items-center justify-center">
                                                <Check size={20} className="transition-transform" />
                                            </div>
                                        )}
                                    </MagneticButton>
                                </div>

                            </fieldset>
                        </form>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <CustomerToast
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                type="info"
                title={confirmModal.title}
                message={confirmModal.message}
                confirmLabel="Confirm Booking"
                closeLabel="Cancel"
                onConfirm={confirmModal.onConfirm}
            />

            {/* Success/Error Toast */}
            <CustomerToast
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
            />
        </div>
    );
}
