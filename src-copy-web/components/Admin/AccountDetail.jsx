import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, UserCheck, User, Mail, Phone, Hash, Calendar, Clock, Lock, Trash2, Key, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { logger } from '../../utils/logger';

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'reservations', label: 'Reservations' },
    { key: 'stamps', label: 'Stamps' },
    { key: 'history', label: 'History' },
    { key: 'rewards', label: 'Rewards' },
    { key: 'security', label: 'Security' }
];

const getRoleStyle = (role) => {
    const styles = {
        admin: { bg: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <Shield size={16} /> },
        staff: { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <UserCheck size={16} /> },
        customer: { bg: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <User size={16} /> }
    };
    return styles[role] || styles.customer;
};

export default function AccountDetail({ user, onBack, onUserDeleted, onUserUpdated, setProcessingMessage }) {
    const [activeTab, setActiveTab] = useState('overview');
    const roleStyle = getRoleStyle(user.role);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-6">
                <button
                    onClick={onBack}
                    className="p-3 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold">{user.first_name} {user.last_name}</h2>
                        <span className={`text-sm font-bold px-4 py-1.5 rounded-full border capitalize flex items-center gap-2 ${roleStyle.bg}`}>
                            {getRoleStyle(user.role).icon}
                            {user.role}
                        </span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${user.is_active !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {user.is_active !== false ? '● Active' : '● Inactive'}
                        </span>
                    </div>
                    <p className="text-neutral-500 text-base mt-2">{user.email}</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-neutral-800/50 p-1.5 rounded-2xl overflow-x-auto">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-3.5 rounded-xl text-base font-bold transition-all whitespace-nowrap
                            ${activeTab === tab.key
                                ? 'bg-neutral-700 text-white shadow-md'
                                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-neutral-800 rounded-2xl border border-neutral-700/50 p-6 min-h-[400px]">
                {activeTab === 'overview' && <OverviewTab user={user} />}
                {activeTab === 'security' && (
                    <SecurityTab
                        user={user}
                        onDeleted={() => { onBack(); if (onUserDeleted) onUserDeleted(); }}
                        onUpdated={onUserUpdated}
                        setProcessingMessage={setProcessingMessage}
                    />
                )}
                {activeTab === 'reservations' && <PlaceholderTab title="Reservations" description="View and manage this user's table reservations." />}
                {activeTab === 'stamps' && <PlaceholderTab title="Stamps" description="Track stamp collection progress and eligible purchases." />}
                {activeTab === 'history' && <PlaceholderTab title="Transaction History" description="View past orders and payment records." />}
                {activeTab === 'rewards' && <PlaceholderTab title="Claimed Rewards" description="Track redeemed rewards and loyalty benefits." />}
            </div>
        </div>
    );
}

// ─── Overview Tab ────────────────────────────────────────────
function OverviewTab({ user }) {
    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const fields = [
        { icon: <Mail size={16} />, label: 'Email', value: user.email },
        { icon: <Phone size={16} />, label: 'Contact', value: user.contact || '—' },
        { icon: <Hash size={16} />, label: 'Account ID', value: user.account_id || '—', mono: true },
        { icon: <Calendar size={16} />, label: 'Joined', value: formatDateTime(user.created_at) },
        { icon: <Clock size={16} />, label: 'Last Login', value: formatDateTime(user.last_login) },
        { icon: <Clock size={16} />, label: 'Last Profile Update', value: formatDateTime(user.last_updated) },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-base font-bold uppercase text-neutral-500 tracking-widest">Account Information</h3>
            <div className="grid gap-4">
                {fields.map((field, i) => (
                    <div key={i} className="flex items-center gap-6 py-4 border-b border-neutral-700/50 last:border-0">
                        <span className="text-neutral-500">{React.cloneElement(field.icon, { size: 20 })}</span>
                        <span className="text-base text-neutral-400 w-40 shrink-0">{field.label}</span>
                        <span className={`text-base font-medium text-neutral-100 ${field.mono ? 'font-mono' : ''}`}>
                            {field.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const SecurityTab = ({ user, onDeleted, onUpdated, setProcessingMessage }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Password strength state
    const [strength, setStrength] = useState({
        score: 0,
        label: 'Weak',
        color: 'bg-red-500',
        feedback: []
    });

    // Real-time strength calculation
    useEffect(() => {
        if (!newPassword) {
            setStrength({ score: 0, label: 'Weak', color: 'bg-red-500', feedback: [] });
            return;
        }

        const requirements = [
            { id: 'length', text: 'Min 8 characters', met: newPassword.length >= 8 },
            { id: 'upper', text: 'Uppercase letter', met: /[A-Z]/.test(newPassword) },
            { id: 'lower', text: 'Lowercase letter', met: /[a-z]/.test(newPassword) },
            { id: 'number', text: 'Number', met: /\d/.test(newPassword) },
            { id: 'special', text: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) }
        ];

        const score = requirements.filter(r => r.met).length;
        let label = 'Weak';
        let color = 'bg-red-500';

        if (score > 4) {
            label = 'Strong';
            color = 'bg-green-500';
        } else if (score > 2) {
            label = 'Moderate';
            color = 'bg-yellow-500';
        }

        setStrength({ score, label, color, feedback: requirements });
    }, [newPassword]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (strength.score < 5) return;
        if (newPassword !== confirmPassword) return;

        setIsUpdating(true);
        if (setProcessingMessage) setProcessingMessage("Updating Security Settings...");
        setUpdateStatus(null);
        try {
            await adminService.changePassword(user.id, newPassword);
            setUpdateStatus({ type: 'success', message: 'Password updated successfully' });
            setNewPassword('');
            setConfirmPassword('');

            // Trigger refresh to update "Last Profile Update" timestamp
            if (onUpdated) onUpdated();
        } catch (error) {
            logger.error("Failed to update password", error);
            setUpdateStatus({ type: 'error', message: 'Failed to update password' });
        } finally {
            setIsUpdating(false);
            if (setProcessingMessage) setProcessingMessage('');
        }
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        if (setProcessingMessage) setProcessingMessage("Deleting Account...");
        try {
            await adminService.deleteUser(user.id);
            onDeleted();
        } catch (error) {
            logger.error("Failed to delete user", error);
            alert("Failed to delete account");
            setShowConfirm(false);
        } finally {
            setIsDeleting(false);
            if (setProcessingMessage) setProcessingMessage('');
        }
    };

    const isMatch = confirmPassword && newPassword === confirmPassword;
    const canUpdate = strength.score >= 5 && isMatch && !isUpdating;

    return (
        <div className="space-y-10">
            {/* Password Reset */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-neutral-300">
                    <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-700">
                        <Key size={28} className="text-brand-accent" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold font-sans">Security Credentials</h3>
                        <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold font-sans">Update user security settings</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-8 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="block text-base font-bold text-neutral-400 uppercase tracking-widest font-sans">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl px-6 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors p-2"
                                >
                                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-base font-bold text-neutral-400 uppercase tracking-widest font-sans">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full bg-neutral-900 border rounded-2xl px-6 py-4 text-xl focus:outline-none transition-colors font-sans
                                        ${confirmPassword
                                            ? (isMatch ? 'border-green-500/50 focus:border-green-500' : 'border-red-500/50 focus:border-red-500')
                                            : 'border-neutral-700 focus:border-green-500'
                                        }`}
                                />
                                {confirmPassword && (
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                        {isMatch
                                            ? <span className="text-green-500 text-sm font-bold uppercase font-sans px-3 py-1 bg-green-500/10 rounded-full">Match</span>
                                            : <span className="text-red-500 text-sm font-bold uppercase font-sans px-3 py-1 bg-red-500/10 rounded-full">Mismatch</span>
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Password Strength Meter */}
                    {newPassword && (
                        <div className="p-8 bg-neutral-900/50 rounded-3xl border border-neutral-700/50 space-y-6">
                            <div className="flex justify-between items-center">
                                <span className={`text-base font-black uppercase tracking-widest font-sans ${strength.color.replace('bg-', 'text-')}`}>
                                    Security Status: {strength.label}
                                </span>
                                <span className="text-neutral-500 text-sm font-bold uppercase font-sans">
                                    {strength.score}/5 Required
                                </span>
                            </div>

                            <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-700 ease-out ${strength.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                                    style={{ width: `${(strength.score / 5) * 100}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                {strength.feedback.map(req => (
                                    <div key={req.id} className="flex items-center gap-3">
                                        <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${req.met ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-neutral-700'}`} />
                                        <span className={`text-base font-bold transition-all duration-300 font-sans ${req.met ? 'text-white' : 'text-neutral-500'}`}>
                                            {req.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <button
                            type="submit"
                            disabled={!canUpdate}
                            className={`px-12 py-5 rounded-2xl font-bold text-xl shadow-xl transition-all active:scale-95 font-sans whitespace-nowrap
                                ${canUpdate
                                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                                    : 'bg-neutral-700 text-neutral-500 cursor-not-allowed opacity-50'
                                }`}
                        >
                            {isUpdating ? 'Applying Changes...' : 'Update Password Hash'}
                        </button>

                        {updateStatus && (
                            <div className={`flex items-center gap-2 font-bold font-sans text-lg animate-in fade-in slide-in-from-left-4
                                ${updateStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {updateStatus.type === 'success' ? '✓' : '✕'} {updateStatus.message}
                            </div>
                        )}
                    </div>
                </form>

                <div className="bg-neutral-900/30 p-6 rounded-2xl border border-white/5">
                    <p className="text-base text-neutral-500 italic font-sans flex items-center gap-3">
                        <Lock size={18} className="text-neutral-600" />
                        Administrator overrides: Updated passwords are immediately hashed and synced to the secure database.
                    </p>
                </div>
            </div>

            <hr className="border-neutral-700/50" />

            {/* Danger Zone */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-red-500">
                    <AlertTriangle size={24} />
                    <h3 className="text-xl font-bold">Danger Zone</h3>
                </div>

                {!showConfirm ? (
                    <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl">
                        <div className="flex justify-between items-center gap-6">
                            <div>
                                <h4 className="text-base font-bold text-neutral-200">Delete Account</h4>
                                <p className="text-sm text-neutral-500 mt-2">Permanently remove this user and all associated data.</p>
                            </div>
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-3 rounded-xl text-base font-bold border border-red-500/20 transition-all flex items-center gap-2"
                            >
                                <Trash2 size={20} />
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="text-red-500 mt-1 shrink-0" size={28} />
                                <div>
                                    <h4 className="text-lg font-bold text-red-400">Are you absolutely sure?</h4>
                                    <p className="text-base text-red-500/80 mt-2 leading-relaxed">
                                        This action is permanent and cannot be reversed. Deleting <strong>{user.first_name}'s</strong> account will remove all reservations, stamps, and history.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    disabled={isDeleting}
                                    onClick={confirmDelete}
                                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white py-4 rounded-xl text-base font-bold transition-all shadow-lg shadow-red-900/20"
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Permanently Delete'}
                                </button>
                                <button
                                    disabled={isDeleting}
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 text-white py-4 rounded-xl text-base font-bold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Placeholder for Future Tabs ─────────────────────────────
function PlaceholderTab({ title, description }) {
    return (
        <div className="text-center py-12 space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-700/50 rounded-full mb-2">
                <Clock size={24} className="text-neutral-500" />
            </div>
            <h3 className="text-lg font-bold text-neutral-300">{title}</h3>
            <p className="text-sm text-neutral-500 max-w-sm mx-auto">{description}</p>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-neutral-600 bg-neutral-800 px-3 py-1 rounded-full">
                Coming Soon
            </span>
        </div>
    );
}
