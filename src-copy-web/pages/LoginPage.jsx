import React, { useState, useEffect } from 'react';
import MagneticButton from '../components/UI/MagneticButton';
import CustomerToast from '../components/UI/CustomerToast';
import { User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage({ onLoginSuccess, initialIsLogin = true }) {
    // Custom hook manages state, validation, and API calls with robust error handling
    const {
        isLogin,
        setIsLogin,
        formData,
        handleChange,
        handleSubmit,
        loading,
        formError,
        passwordStrength,
        isPasswordStrong
    } = useAuth((user) => {
        // Block staff/admin accounts — they must use the staff portal
        if (user.role === 'admin' || user.role === 'staff') {
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Wrong Portal',
                message: 'Staff accounts must log in via the staff portal. Please visit /admin to access your dashboard.'
            });
            return; // Don't proceed to customer area
        }

        // Intercept success to show modal first
        setModal({
            isOpen: true,
            type: 'success',
            title: isLogin ? 'Welcome Back!' : 'Account Created',
            message: isLogin ? `Good to see you again, ${user.firstName}.` : 'Your account has been successfully created.'
        });

        // Delay navigation to let user see the modal
        setTimeout(() => {
            onLoginSuccess(user);
        }, 1500);
    }, initialIsLogin);


    const [showPassword, setShowPassword] = useState(false);

    // UI-specific State: Modal for error display
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'success', // 'success' | 'error'
        title: '',
        message: ''
    });

    // Sync hook errors to UI Modal
    useEffect(() => {
        if (formError) {
            setModal({
                isOpen: true,
                type: 'error',
                title: isLogin ? 'Login Failed' : 'Signup Error',
                message: formError
            });
        }
    }, [formError, isLogin]);

    const handleCloseModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-brand-primary">
            <div className="w-full max-w-sm animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-sans font-bold text-neutral-900 tracking-tighter mb-2">
                        {isLogin ? "Welcome Back." : "Join Catsy."}
                    </h1>
                    <p className="text-neutral-500">
                        {isLogin ? "Sign in to your private portal." : "Start your coffee journey today."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider ml-4">First Name</label>
                                <div className="flex items-center bg-white p-4 rounded-full border border-neutral-100 focus-within:ring-2 focus-within:ring-brand-accent transition-shadow">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-transparent outline-none font-bold text-neutral-900 placeholder:font-normal"
                                        placeholder="Jane"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider ml-4">Last Name</label>
                                <div className="flex items-center bg-white p-4 rounded-full border border-neutral-100 focus-within:ring-2 focus-within:ring-brand-accent transition-shadow">
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full bg-transparent outline-none font-bold text-neutral-900 placeholder:font-normal"
                                        placeholder="Doe"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider ml-4">Email / Username</label>
                        <div className="flex items-center bg-white p-4 rounded-full border border-neutral-100 focus-within:ring-2 focus-within:ring-brand-accent transition-shadow">
                            <User size={20} className="text-neutral-400 mr-3 shrink-0" />
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none font-bold text-neutral-900 placeholder:font-normal"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider ml-4">Password</label>
                        <div className="flex items-center bg-white p-4 rounded-full border border-neutral-100 focus-within:ring-2 focus-within:ring-brand-accent transition-shadow">
                            <Lock size={20} className="text-neutral-400 mr-3 shrink-0" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none font-bold text-neutral-900 placeholder:font-normal"
                                placeholder="• • • • • •"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-neutral-400 hover:text-neutral-600 transition-colors ml-2"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Password Strength Indicator (Sign-up only) */}
                        {!isLogin && formData.password && (
                            <div className="px-4 pt-1 space-y-3">
                                {/* Strength Bar */}
                                <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                    />
                                </div>

                                {/* Strength Label and Checklist */}
                                <div className="flex justify-between items-center">
                                    <span className={`text-[10px] font-bold uppercase ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {passwordStrength.feedback.map(req => (
                                        <div key={req.id} className="flex items-center gap-1.5">
                                            <div className={`w-1 h-1 rounded-full ${req.met ? 'bg-green-500' : 'bg-neutral-200'}`} />
                                            <span className={`text-[10px] ${req.met ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                                {req.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider ml-4">Confirm Password</label>
                            <div className="flex items-center bg-white p-4 rounded-full border border-neutral-100 focus-within:ring-2 focus-within:ring-brand-accent transition-shadow">
                                <Lock size={20} className="text-neutral-400 mr-3 shrink-0" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-transparent outline-none font-bold text-neutral-900 placeholder:font-normal"
                                    placeholder="Confirm password"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <MagneticButton
                        type="submit"
                        disabled={loading || !isPasswordStrong}
                        className={`w-full py-4 rounded-full font-bold text-xl shadow-xl mt-4 relative overflow-hidden group transition-all
                            ${(loading || !isPasswordStrong) ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'bg-neutral-900 text-white'}
                        `}
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
                            <span>{loading ? "Processing..." : (isLogin ? "Login" : "Create Account")}</span>
                            {!loading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
                        </div>
                    </MagneticButton>
                </form>

                <div className="mt-12 text-center space-y-4">
                    <p className="text-sm text-neutral-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setModal(prev => ({ ...prev, isOpen: false })); }}
                            className="ml-2 font-bold text-neutral-900 underline hover:text-brand-accent transition-colors"
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </p>

                    {isLogin && (
                        <p className="text-xs text-neutral-400">
                            <a href="#" className="hover:text-neutral-900 transition-colors">Forgot Password?</a>
                        </p>
                    )}
                </div>
            </div>

            {/* Customer-themed notification */}
            <CustomerToast
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
            />
        </div>
    );
}
