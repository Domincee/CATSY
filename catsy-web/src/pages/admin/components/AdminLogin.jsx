import { useState } from 'react';
import { adminService } from '../../../services/adminService';
import { logger } from '../../../utils/logger';
import { saveSession } from '../../../utils/sessionManager';
import { Coffee, ShieldCheck, Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await adminService.login(email, password);

            if (response && response.user) {
                logger.log("Admin Login Success:", response.user);

                // Show success state
                setSuccess(true);

                // Construct user object with token if needed by session manager
                const userWithToken = {
                    ...response.user,
                    access_token: response.access_token
                };

                // Save session using the shared utility
                saveSession(userWithToken);

                // Delay redirect to show success message
                setTimeout(() => {
                    onLoginSuccess(userWithToken);
                }, 1500);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            logger.error("Admin Login Failed:", err);
            setError(err.message || "Login failed. Please check your credentials.");
            setLoading(false); // Only stop loading on error, keep loading/success on success
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(45,45,45,1),transparent)]">
            <div className="w-full max-w-md">
                {/* Logo & Branding */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-white/10 rotate-12 transition-transform hover:rotate-0 duration-500">
                        <Coffee size={40} className="text-neutral-900 -rotate-12 group-hover:rotate-0 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-black font-display text-white mb-2 tracking-tight">Backstage Admin</h1>
                    <p className="text-neutral-500 font-medium uppercase tracking-[0.2em] text-xs">Authorized Personnel Only</p>
                </div>

                {/* Login Card */}
                <div className="bg-neutral-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-3xl overflow-hidden relative">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                                <ShieldCheck size={40} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Access Granted</h2>
                            <p className="text-neutral-400">Redirecting to dashboard...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 animate-shake">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <p className="text-sm font-bold">{error}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-neutral-500 ml-4 font-sans">Admin Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-white transition-colors">
                                        <Mail size={22} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-neutral-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-white/20 focus:bg-neutral-900 transition-all text-white text-lg font-bold font-sans"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase tracking-[0.2em] text-neutral-500 ml-4 font-sans">Access Key</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-white transition-colors">
                                        <Lock size={22} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-neutral-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-14 outline-none focus:border-white/20 focus:bg-neutral-900 transition-all text-white text-lg font-bold font-sans"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] font-sans ${loading
                                    ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                                    : 'bg-white hover:bg-neutral-200 text-neutral-900 shadow-xl shadow-white/10'
                                    }`}
                            >
                                {loading ? (
                                    <Loader2 size={24} className="animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck size={22} />
                                        <span>Unlock Dashboard</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="text-neutral-600 hover:text-neutral-400 font-bold text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <span>&larr;</span> Back to Main Store
                    </button>
                </div>
            </div>
        </div>
    );
}
