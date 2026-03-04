import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import { logger } from '../utils/logger';
import { saveSession } from '../utils/sessionManager';

export function useProfile(userInfo, setUserInfo) {
    // ----------------------
    // Profile Editing Logic
    // ----------------------
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        ...userInfo,
        password: '' // Start empty for change
    });
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: 'Weak',
        color: 'bg-red-500',
        feedback: []
    });

    // Password strength logic
    useEffect(() => {
        if (!editForm.password) {
            setPasswordStrength({ score: 0, label: 'Weak', color: 'bg-red-500', feedback: [] });
            return;
        }

        const p = editForm.password;
        const requirements = [
            { id: 'length', text: 'Min 8 characters', met: p.length >= 8 },
            { id: 'upper', text: 'Uppercase letter', met: /[A-Z]/.test(p) },
            { id: 'lower', text: 'Lowercase letter', met: /[a-z]/.test(p) },
            { id: 'number', text: 'Number', met: /\d/.test(p) },
            { id: 'special', text: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(p) }
        ];

        const metCount = requirements.filter(r => r.met).length;
        let score = metCount;
        let label = 'Weak';
        let color = 'bg-red-500';

        if (score > 4) {
            label = 'Strong';
            color = 'bg-green-500';
        } else if (score > 2) {
            label = 'Moderate';
            color = 'bg-yellow-500';
        }

        setPasswordStrength({ score, label, color, feedback: requirements });
    }, [editForm.password]);

    const handleEditClick = () => {
        setEditForm({
            ...userInfo,
            password: ''
        }); // Reset form to current saved state
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditForm({
            ...userInfo,
            password: ''
        }); // Revert to original
    };

    const handleSaveClick = async () => {
        try {
            const updatePayload = { ...editForm };

            if (!updatePayload.password) {
                delete updatePayload.password;
            }

            const updated = await customerService.updateProfile(userInfo.id, updatePayload);

            const mappedUser = {
                ...userInfo,
                ...updated,
                // Preserve tokens if not provided in the update response (backend update usually doesn't return new tokens)
                access_token: updated.access_token || userInfo.access_token,
                refresh_token: updated.refresh_token || userInfo.refresh_token,
                firstName: updated.first_name,
                lastName: updated.last_name,
                phone: updated.contact,
                accountId: updated.account_id
            };

            if (mappedUser.password) delete mappedUser.password;

            setUserInfo(mappedUser);
            saveSession(mappedUser);
            setIsEditing(false);
            return { success: true };
        } catch (error) {
            logger.error("Failed to update profile", error);

            let errorMessage = "Could not save changes. Please try again.";

            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (error?.detail) {
                errorMessage = error.detail;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        // Input sanitization
        if (name === 'firstName' || name === 'lastName') {
            sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
        } else if (name === 'phone') {
            sanitizedValue = value.replace(/[^0-9]/g, '');
        }

        setEditForm(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));
    };


    // ----------------------
    // Review / Transaction Logic
    // ----------------------
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [ratings, setRatings] = useState({ drinks: 5, service: 5, place: 5 });

    const openReviewModal = (transaction) => {
        setSelectedTransaction(transaction);
        setShowReviewModal(true);
        setRatings(transaction.ratings || { drinks: 5, service: 5, place: 5 });
    };

    const submitReview = async () => {
        if (!selectedTransaction) return;

        // Make a deep copy to mock updating the 'local' history for this session
        const history = userInfo.history || [];
        const updatedHistory = history.map(h =>
            h.id === selectedTransaction.id
                ? { ...h, ratings: ratings, isRated: true }
                : h
        );

        // Update global userInfo state
        setUserInfo(prev => ({
            ...prev,
            history: updatedHistory
        }));

        setShowReviewModal(false);

        try {
            // Ideally: await apiClient(`/customer/orders/${selectedTransaction.id}/rate`, { ... });
            logger.log("Review submitted for order", selectedTransaction.id, ratings);
        } catch (error) {
            logger.error("Failed to submit review", error);
        }
    };

    // Helper
    const getAverageRating = (r) => {
        if (!r) return null;
        const { drinks = 0, service = 0, place = 0 } = r;
        const avg = (drinks + service + place) / 3;
        return avg.toFixed(1);
    };


    return {
        // Profile Edit
        isEditing,
        editForm,
        passwordStrength,
        isPasswordValid: !editForm.password || passwordStrength.score >= 5,
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
    };
}
