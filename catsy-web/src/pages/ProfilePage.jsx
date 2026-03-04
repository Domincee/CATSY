import React, { useState, useCallback } from 'react';
import IdentityHub from '../components/Dashboard/IdentityHub';
import CustomerToast from '../components/UI/CustomerToast';
import { Clock, Heart, Edit2, Save, X, Star, Lock, Check, Calendar } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { mapAuthError } from '../utils/errorHandler';
import { useUser } from '../context/UserContext';
import { reservationService } from '../services/reservationService';
import { useSSE } from '../hooks/useSSE';

export default function ProfilePage() {
    const { userInfo, setUserInfo } = useUser();
    // Error modal state
    const [errorModal, setErrorModal] = useState({ show: false, title: '', message: '' });
    // Save confirmation modal state
    const [saveConfirmModal, setSaveConfirmModal] = useState({ show: false });
    // Success modal state
    const [successModal, setSuccessModal] = useState({ show: false });

    // Reservation History
    const [reservationHistory, setReservationHistory] = useState([]);
    const [isLoadingReservations, setIsLoadingReservations] = useState(true);

    const fetchReservationHistory = useCallback(async () => {
        if (!userInfo) return;
        try {
            const reservations = await reservationService.getMyReservations();
            const pastReservations = reservations.filter(r =>
                ['completed', 'cancelled', 'rejected'].includes(r.status)
            );
            setReservationHistory(pastReservations);
        } catch (error) {
            console.error("Failed to fetch reservation history in profile", error);
        } finally {
            setIsLoadingReservations(false);
        }
    }, [userInfo]);

    React.useEffect(() => {
        fetchReservationHistory();
    }, [fetchReservationHistory]);

    // Real-time: when admin updates a reservation, instantly refresh history
    useSSE({ 'reservation.updated': fetchReservationHistory });

    const {
        // Profile Edit
        isEditing,
        editForm,
        passwordStrength,
        isPasswordValid,
        handleEditClick,
        handleCancelClick,
        handleSaveClick,
        handleInputChange,

        // Reviews
        showReviewModal,
        setShowReviewModal,
        selectedTransaction,
        openReviewModal,
        ratings,
        setRatings,
        submitReview,
        getAverageRating
    } = useProfile(userInfo, setUserInfo);

    // Triggered when user clicks "Save"
    const handleSaveInitiate = () => {
        // Guard: block save if nothing was actually changed
        const hasChanges =
            (editForm.firstName ?? '') !== (userInfo.firstName ?? '') ||
            (editForm.lastName ?? '') !== (userInfo.lastName ?? '') ||
            (editForm.email ?? '') !== (userInfo.email ?? '') ||
            (editForm.phone ?? '') !== (userInfo.phone ?? '') ||
            (editForm.password ?? '') !== '';

        if (!hasChanges) {
            setErrorModal({
                show: true,
                title: 'No Changes Detected',
                message: 'You have not made any changes to your profile. Please update a field before saving.',
            });
            return;
        }
        setSaveConfirmModal({ show: true });
    };

    // Actual API call after confirmation
    const onSaveConfirm = async () => {
        setSaveConfirmModal({ show: false });
        const result = await handleSaveClick();
        if (result.success) {
            setSuccessModal({ show: true });
        } else {
            const formattedError = mapAuthError({ message: result.error });
            setErrorModal({
                show: true,
                title: formattedError.title,
                message: formattedError.message
            });
        }
    };

    // Use userInfo props directly - no fallbacks to mock data
    const favoriteItem = userInfo.favoriteItem;
    // Ensure history is an array. If undefined, default to empty array
    const history = userInfo.history || [];

    return (
        <div className="min-h-screen pt-24 px-6 animate-fade-in pb-32">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-sans font-bold text-neutral-900">My Profile</h1>

                {/* Edit Button — only shown when not editing */}
                {!isEditing && (
                    <button
                        onClick={handleEditClick}
                        className="flex items-center gap-2 text-sm font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-4 py-2 rounded-full transition-colors"
                    >
                        <Edit2 size={16} /> Edit
                    </button>
                )}
            </div>

            {/* Reused Identity Hub (QR) */}
            <IdentityHub user={userInfo} />

            {/* Favorites - only show if exists */}
            {favoriteItem && (
                <div>
                    <h2 className="text-xl font-sans font-bold text-neutral-900 mb-4 flex items-center gap-2">
                        <Heart size={20} className="text-red-500 fill-red-500" /> Favorite
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="px-6 py-3 text-black bg-white border border-neutral-100 rounded-full font-bold text-sm whitespace-nowrap shadow-sm">
                            {favoriteItem}
                        </div>
                    </div>
                </div>
            )}

            {/* User Details Form */}
            <div className="mb-12 space-y-6 mt-8">

                {/* Vertical Profile Details */}
                <div className="flex flex-col gap-6">

                    {/* First Name */}
                    <div>
                        <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-1 block">First Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="firstName"
                                value={editForm.firstName}
                                onChange={handleInputChange}
                                className="w-full text-xl font-bold text-neutral-900 border-b-2 border-brand-accent pb-1 outline-none bg-transparent"
                            />
                        ) : (
                            <div className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-2">{userInfo.firstName || 'N/A'}</div>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-1 block">Last Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="lastName"
                                value={editForm.lastName}
                                onChange={handleInputChange}
                                className="w-full text-xl font-bold text-neutral-900 border-b-2 border-brand-accent pb-1 outline-none bg-transparent"
                            />
                        ) : (
                            <div className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-2">{userInfo.lastName || 'N/A'}</div>
                        )}
                    </div>

                </div>

                {/* Email */}
                <div>
                    <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-1 block">Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                            className="w-full text-xl font-bold text-neutral-900 border-b-2 border-brand-accent pb-1 outline-none bg-transparent"
                        />
                    ) : (
                        <div className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-2">{userInfo.email || 'N/A'}</div>
                    )}
                </div>

                {/* Contact Number */}
                <div className="pb-4">
                    <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-1 block">Contact Number</label>
                    {isEditing ? (
                        <input
                            type="tel"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleInputChange}
                            className="w-full text-xl font-bold text-neutral-900 border-b-2 border-brand-accent pb-1 outline-none bg-transparent"
                        />
                    ) : (
                        <div className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-2">{userInfo.phone || 'N/A'}</div>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-1 block">Account Password</label>
                    {isEditing ? (
                        <div className="relative">
                            <input
                                type="text"
                                name="password"
                                value={editForm.password}
                                onChange={handleInputChange}
                                className="w-full text-xl font-bold text-neutral-900 border-b-2 border-brand-accent pb-1 outline-none bg-transparent pr-10"
                                placeholder="Enter new password"
                            />
                            <Lock size={18} className="absolute right-0 top-1.5 text-neutral-400" />
                        </div>
                    ) : (
                        <div className="text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-2">••••••••</div>
                    )}

                    {isEditing && (
                        <div className="mt-3 space-y-3">
                            {/* Strength Bar */}
                            <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                />
                            </div>

                            {/* Strength Label */}
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] text-neutral-400 italic">
                                    {editForm.password ? 'Password Strength' : '* Leave empty to keep current password.'}
                                </p>
                                {editForm.password && (
                                    <span className={`text-[10px] font-bold uppercase ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                        {passwordStrength.label}
                                    </span>
                                )}
                            </div>

                            {/* Requirements Grid */}
                            {editForm.password && (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
                                    {passwordStrength.feedback.map(req => (
                                        <div key={req.id} className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${req.met ? 'bg-green-500' : 'bg-neutral-200'}`} />
                                            <span className={`text-[10px] ${req.met ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                                {req.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* Save/Cancel Buttons */}
            {isEditing && (
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={handleCancelClick}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-6 py-3 rounded-full transition-colors"
                    >
                        <X size={16} /> Cancel
                    </button>
                    <button
                        onClick={handleSaveInitiate}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-bold bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-full transition-colors"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            )}

            {/* Error Toast */}
            <CustomerToast
                isOpen={errorModal.show}
                onClose={() => setErrorModal({ show: false, title: '', message: '' })}
                title={errorModal.title}
                message={errorModal.message}
                type="error"
            />

            {/* Save Confirmation Toast */}
            <CustomerToast
                isOpen={saveConfirmModal.show}
                onClose={() => setSaveConfirmModal({ show: false })}
                onConfirm={onSaveConfirm}
                title="Update Profile?"
                message="Are you sure you want to save these changes to your profile details?"
                confirmLabel="Yes, Update"
                type="success"
            />

            {/* Success Toast */}
            <CustomerToast
                isOpen={successModal.show}
                onClose={() => setSuccessModal({ show: false })}
                title="Update Complete"
                message="Your profile has been successfully updated."
                type="success"
            />

            {/* History Tabs - Only show if there is history */}
            {history.length > 0 && (
                <div className="space-y-8">
                    {/* Transaction History */}
                    <div>
                        <h2 className="text-xl font-sans font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-neutral-400" /> Transaction History
                        </h2>
                        <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden">
                            {history.map((order) => {
                                const avgRating = getAverageRating(order.ratings);
                                return (
                                    <div
                                        key={order.id}
                                        onClick={() => openReviewModal(order)}
                                        className="flex justify-between items-center p-4 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer active:bg-neutral-100"
                                    >
                                        <div className="flex flex-col">
                                            <p className="font-bold text-neutral-900 text-lg">{order.date}</p>
                                            <p className="text-xs text-neutral-400 font-mono">{order.isRated ? `You rated: ${avgRating} ★` : 'Tap to rate'}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {order.isRated ? (
                                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                                    <Star size={14} className="fill-yellow-500 text-yellow-500" />
                                                </div>
                                            ) : (
                                                <button className="bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-black transition-colors">
                                                    Rate
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Show message if no history */}
            {history.length === 0 && (
                <div className="text-center py-10 opacity-50 mb-8">
                    <Clock size={40} className="mx-auto mb-2 text-neutral-300" />
                    <p className="text-sm font-bold text-neutral-400">No transaction history yet.</p>
                </div>
            )}

            {/* Reservation History Section */}
            <div className="space-y-8 mt-8">
                <div>
                    <h2 className="text-xl font-sans font-bold text-neutral-900 mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-neutral-400" /> Reservation History
                    </h2>

                    {isLoadingReservations ? (
                        <div className="text-center py-10 opacity-50">
                            <Clock size={40} className="mx-auto mb-2 text-neutral-300 animate-pulse" />
                            <p className="text-sm font-bold text-neutral-400">Loading reservations...</p>
                        </div>
                    ) : reservationHistory.length > 0 ? (
                        <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden">
                            {reservationHistory.map((res) => (
                                <div key={res.id} className="flex justify-between items-center p-4 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-neutral-900 text-lg">
                                            {new Date(res.reservation_time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-xs text-neutral-400 font-mono">{res.guest_count} Guests</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 bg-opacity-10 rounded-full text-xs font-bold uppercase tracking-wider
                                            ${res.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                            {res.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 opacity-50">
                            <Calendar size={40} className="mx-auto mb-2 text-neutral-300" />
                            <p className="text-sm font-bold text-neutral-400">No previous reservations.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedTransaction && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
                    <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up-fade">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-1">Transaction Details</h3>
                                <p className="text-sm text-neutral-500 font-mono">{selectedTransaction.date}</p>
                            </div>
                            <button onClick={() => setShowReviewModal(false)} className="p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 text-neutral-900 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Order Details */}
                        <div className="bg-neutral-50 p-4 rounded-xl mb-6">
                            <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-2">Bought Items</h4>
                            <ul className="list-disc list-inside mb-2">
                                {/* Ensure items is an array before mapping */}
                                {selectedTransaction.items && selectedTransaction.items.map((item, idx) => (
                                    <li key={idx} className="font-bold text-neutral-900 text-sm">{item}</li>
                                ))}
                            </ul>
                            <p className="text-xs text-neutral-500 mt-1 font-mono">Total: {selectedTransaction.totalPrice}</p>
                        </div>

                        <div className="flex flex-col gap-6">

                            {/* Star Ratings Categories */}
                            <div>
                                <h4 className="text-center text-sm font-bold text-neutral-900 mb-4">Rate your experience</h4>

                                {/* Drinks */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-neutral-500 w-16">Drinks</span>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRatings(prev => ({ ...prev, drinks: star }))}
                                                className="transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star
                                                    size={24}
                                                    className={`${star <= ratings.drinks ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300 fill-neutral-100'}`}
                                                    strokeWidth={1}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Service */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-neutral-500 w-16">Service</span>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRatings(prev => ({ ...prev, service: star }))}
                                                className="transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star
                                                    size={24}
                                                    className={`${star <= ratings.service ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300 fill-neutral-100'}`}
                                                    strokeWidth={1}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Place */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-neutral-500 w-16">Place</span>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRatings(prev => ({ ...prev, place: star }))}
                                                className="transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star
                                                    size={24}
                                                    className={`${star <= ratings.place ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300 fill-neutral-100'}`}
                                                    strokeWidth={1}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Comment */}
                            <div>
                                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-2 block">Tell us more details <span className="font-normal lowercase text-neutral-300">(optional)</span></label>
                                <textarea
                                    className="w-full bg-neutral-50 rounded-xl p-4 text-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
                                    rows="3"
                                    placeholder="What did you like? What could be better?"
                                ></textarea>
                            </div>

                            {/* Submit */}
                            <button
                                disabled={!ratings.drinks || !ratings.service || !ratings.place}
                                onClick={submitReview}
                                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${(!ratings.drinks || !ratings.service || !ratings.place)
                                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                    : 'bg-neutral-900 text-white hover:bg-black'
                                    }`}
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
