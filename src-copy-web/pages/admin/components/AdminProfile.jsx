import React, { useState } from 'react';
import { User, Mail, Shield, Key, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';

export default function AdminProfile({ userInfo, setStatusModal, setProcessingMessage }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        if (setProcessingMessage) setProcessingMessage('Updating Profile Security...');
        try {
            await adminService.changePassword(userInfo.id, newPassword);
            setSuccess("Password updated successfully");
            setNewPassword('');
            setConfirmPassword('');

            // Optional: Show status modal if parent passed it
            if (setStatusModal) {
                setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Password Updated',
                    message: 'Your password has been changed successfully.'
                });
            }

        } catch (err) {
            setError(err.message || "Failed to update password");
        } finally {
            setLoading(false);
            if (setProcessingMessage) setProcessingMessage('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 border-4 border-neutral-700 shadow-xl flex items-center justify-center text-4xl font-bold text-white font-display">
                        {userInfo?.first_name?.[0]}{userInfo?.last_name?.[0]}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1 font-display">
                            {userInfo?.first_name} {userInfo?.last_name}
                        </h2>
                        <div className="flex items-center gap-2 text-neutral-400 font-medium">
                            <Shield size={16} className="text-brand-accent" />
                            <span className="capitalize">{userInfo?.role || 'Admin'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Details Card */}
                <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] h-full">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User size={20} className="text-brand-accent" />
                        Profile Details
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-neutral-300">
                                <Mail size={18} className="text-neutral-500" />
                                {userInfo?.email}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Role</label>
                            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-neutral-300 capitalize">
                                <Shield size={18} className="text-neutral-500" />
                                {userInfo?.role}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Account ID</label>
                            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-neutral-300 font-mono text-sm">
                                <span className="text-neutral-500">#</span>
                                {userInfo?.account_id || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Reset Card */}
                <div className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] h-full">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Key size={20} className="text-brand-accent" />
                        Security Settings
                    </h3>

                    <form onSubmit={handlePasswordReset} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 animate-shake">
                                <AlertCircle size={16} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-center gap-2">
                                <CheckCircle2 size={16} className="shrink-0" />
                                {success}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-brand-accent/50 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-neutral-900/50 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-brand-accent/50 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newPassword}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4
                                ${loading || !newPassword
                                    ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                                    : 'bg-white text-neutral-900 hover:bg-neutral-200 shadow-lg shadow-white/5 active:scale-[0.98]'
                                }`}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
