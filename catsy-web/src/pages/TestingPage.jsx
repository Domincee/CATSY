import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { useUser } from '../context/UserContext';
import {
    ShieldAlert,
    ShieldCheck,
    Lock,
    Unlock,
    Loader2,
    Terminal,
    Database,
    Shield,
    Fingerprint,
    Zap,
    AlertTriangle,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { apiClient } from '../services/api';
import { customerService } from '../services/customerService';
import { adminService } from '../services/adminService';
import { logger } from '../utils/logger';

export default function TestingPage() {
    const { userInfo, isLoggedIn, login, logout } = useUser();
    const [status, setStatus] = useState({ type: null, message: '', loading: false, details: null });
    const [testHistory, setTestHistory] = useState([]);
    const [loginLoading, setLoginLoading] = useState(false);

    // Role-specific login states
    const [creds, setCreds] = useState({
        admin: { email: '', password: '' },
        staff: { email: '', password: '' },
        customer: { email: '', password: '' }
    });

    const handleRoleLogin = async (roleKey) => {
        const { email, password } = creds[roleKey];
        if (!email || !password) return;

        setLoginLoading(true);
        setStatus({ type: null, message: `Authenticating as ${roleKey}...`, loading: true });
        try {
            const result = await customerService.login({
                username: email,
                password: password
            });

            login(result);
            setStatus({ type: 'error', message: `Identity switched to ${email} (${roleKey})` });
            setTestHistory(prev => [{ time: new Date().toLocaleTimeString(), type: 'AUTH', status: 'SUCCESS', color: 'text-blue-500' }, ...prev]);
        } catch (error) {
            setStatus({
                type: 'success',
                message: `Auth Failed: ${error.message}`
            });
        } finally {
            setLoginLoading(false);
        }
    };

    const updateCreds = (role, field, value) => {
        setCreds(prev => ({
            ...prev,
            [role]: { ...prev[role], [field]: value }
        }));
    };

    const handleTest = async (testType) => {
        const timestamp = new Date().toLocaleTimeString();
        setStatus({ type: null, message: '', loading: true, details: null });

        try {
            let result;
            if (testType === 'category') {
                result = await productService.createCategory({
                    name: "Exploit Category " + Date.now(),
                    description: "Unauthorized write attempt"
                });
            } else if (testType === 'product') {
                result = await productService.createProduct({
                    product_name: "Exploit Coffee " + Date.now(),
                    product_price: 999.99,
                    category_id: 1
                });
            }

            const successMsg = `CRITICAL: Unauthorized ${testType} creation bypassed security filters!`;
            setStatus({ type: 'success', message: successMsg, details: result });
            setTestHistory(prev => [{ time: timestamp, type: testType, status: 'BYPASS', color: 'text-red-500' }, ...prev]);
            logger.log('Security failure detected in test page', result);

        } catch (error) {
            const errorMsg = error.message || 'Connection refused';
            setStatus({ type: 'error', message: `BLOCKED: ${errorMsg}` });
            setTestHistory(prev => [{ time: timestamp, type: testType, status: 'DENIED', color: 'text-green-500' }, ...prev]);
        } finally {
            setStatus(prev => ({ ...prev, loading: false }));
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 font-display relative pb-20">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="relative z-10 w-full px-8 py-12 grid grid-cols-12 gap-8">

                {/* Left Column: Control Panel */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8 h-full">

                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500 flex items-center justify-center rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                                <Shield size={24} className="text-black" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight uppercase italic">Security Lab <span className="text-orange-500">v2.4</span></h1>
                                <p className="text-neutral-500 text-[10px] font-bold tracking-[0.3em] uppercase">Auth & RLS Verification Environment</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">Active Identity</span>
                                <span className="text-sm font-bold truncate max-w-[200px]">{userInfo?.email || 'Unauthorized_Guest'}</span>
                            </div>
                            <div className={`p-2 rounded-lg ${isLoggedIn ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                <Fingerprint size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Role-Specific Access Point Section */}
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={20} className="text-blue-500" />
                                <h3 className="font-black text-sm uppercase tracking-widest text-neutral-300">Internal Access Point</h3>
                            </div>
                            {isLoggedIn && (
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all font-display"
                                >
                                    Force Termination
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Admin Pod */}
                            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl space-y-4 relative overflow-hidden group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-red-500 text-black rounded-lg"><Shield size={14} /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Admin Protocol</span>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <input
                                        type="email" placeholder="admin@catsy.com"
                                        value={creds.admin.email} onChange={(e) => updateCreds('admin', 'email', e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold focus:border-red-500 outline-none transition-all"
                                    />
                                    <input
                                        type="password" placeholder="••••••••"
                                        value={creds.admin.password} onChange={(e) => updateCreds('admin', 'password', e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold focus:border-red-500 outline-none transition-all font-mono"
                                    />
                                    <button
                                        onClick={() => handleRoleLogin('admin')}
                                        disabled={loginLoading}
                                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
                                    >
                                        Initiate Admin Access
                                    </button>
                                </div>
                                <div className="absolute -bottom-4 -right-4 opacity-[0.05] group-hover:scale-110 transition-transform"><Shield size={80} /></div>
                            </div>

                            {/* Staff Pod */}
                            <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl space-y-4 relative overflow-hidden group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-orange-500 text-black rounded-lg"><Lock size={14} /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Staff Protocol</span>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <input
                                        type="email" placeholder="staff@catsy.com"
                                        value={creds.staff.email} onChange={(e) => updateCreds('staff', 'email', e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold focus:border-orange-500 outline-none transition-all"
                                    />
                                    <input
                                        type="password" placeholder="••••••••"
                                        value={creds.staff.password} onChange={(e) => updateCreds('staff', 'password', e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold focus:border-orange-500 outline-none transition-all font-mono"
                                    />
                                    <button
                                        onClick={() => handleRoleLogin('staff')}
                                        disabled={loginLoading}
                                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
                                    >
                                        Initiate Staff Access
                                    </button>
                                </div>
                                <div className="absolute -bottom-4 -right-4 opacity-[0.05] group-hover:scale-110 transition-transform"><Lock size={80} /></div>
                            </div>

                            {/* Customer Pod */}
                            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-4 relative overflow-hidden group">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-blue-500 text-black rounded-lg"><Unlock size={14} /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Customer Protocol</span>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <input
                                        type="email" placeholder="customer@catsy.com"
                                        value={creds.customer.email} onChange={(e) => updateCreds('customer', 'email', e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold focus:border-blue-500 outline-none transition-all"
                                    />
                                    <input
                                        type="password" placeholder="••••••••"
                                        value={creds.customer.password} onChange={(e) => updateCreds('customer', 'password', e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold focus:border-blue-500 outline-none transition-all font-mono"
                                    />
                                    <button
                                        onClick={() => handleRoleLogin('customer')}
                                        disabled={loginLoading}
                                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
                                    >
                                        Initiate Customer Access
                                    </button>
                                </div>
                                <div className="absolute -bottom-4 -right-4 opacity-[0.05] group-hover:scale-110 transition-transform"><Unlock size={80} /></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Test Area */}
                    <div className="flex-1 grid grid-cols-2 gap-6 pb-8">

                        {/* Status Monitor (Full Width) */}
                        <div className="col-span-2 bg-neutral-900/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group min-h-[400px]">
                            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors">
                                <Database size={120} strokeWidth={1} />
                            </div>

                            {!status.type && !status.loading && (
                                <div className="space-y-6 max-w-md">
                                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
                                        <Zap size={32} className="text-neutral-500" />
                                    </div>
                                    <h2 className="text-2xl font-black">System Ready</h2>
                                    <p className="text-neutral-500 text-sm leading-relaxed">
                                        Select an attack vector below to test Row Level Security (RLS) policies.
                                        A properly secured system should block all unauthorized write attempts.
                                    </p>
                                </div>
                            )}

                            {status.loading && (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto" />
                                        <Loader2 size={32} className="absolute inset-0 m-auto animate-spin text-orange-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black animate-pulse uppercase italic">Intercepting...</h2>
                                        <p className="text-neutral-500 text-xs font-bold tracking-widest mt-2 uppercase">Verifying Authorization Header & JWT Claims</p>
                                    </div>
                                </div>
                            )}

                            {status.type && (
                                <div className={`space-y-6 animate-in fade-in zoom-in duration-500`}>
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4 ${status.type === 'error' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
                                        }`}>
                                        {status.type === 'error' ? <ShieldCheck size={48} /> : <AlertTriangle size={48} />}
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className={`text-3xl font-black uppercase italic ${status.type === 'error' ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                            {status.type === 'error' ? 'Attack Deflected' : 'Security Breach'}
                                        </h2>
                                        <p className="text-neutral-200 font-bold max-w-sm px-4 mx-auto">{status.message}</p>
                                    </div>

                                    {status.type === 'error' && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                                            <CheckCircle2 size={12} /> RLS Working as Intended
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Control Buttons (Attack Vectors) */}
                        <button
                            onClick={() => handleTest('category')}
                            disabled={status.loading}
                            className="bg-neutral-900/40 hover:bg-white/5 border border-white/5 rounded-[2rem] p-8 transition-all group relative active:scale-[0.98] disabled:opacity-50 text-left overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col items-start justify-between h-full">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <Database size={24} className="text-neutral-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white group-hover:text-orange-500 transition-colors">Write: Categories</h3>
                                    <p className="text-xs text-neutral-500 mt-2 font-medium">Attempt to inject a new category record.</p>
                                </div>
                            </div>
                            <div className="absolute bottom-[-20%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                <Lock size={160} />
                            </div>
                        </button>

                        <button
                            onClick={() => handleTest('product')}
                            disabled={status.loading}
                            className="bg-neutral-900/40 hover:bg-white/5 border border-white/5 rounded-[2rem] p-8 transition-all group relative active:scale-[0.98] disabled:opacity-50 text-left overflow-hidden"
                        >
                            <div className="relative z-10 flex flex-col items-start justify-between h-full">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <Zap size={24} className="text-neutral-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white group-hover:text-orange-500 transition-colors">Write: Products</h3>
                                    <p className="text-xs text-neutral-500 mt-2 font-medium">Attempt to execute a POST request on products.</p>
                                </div>
                            </div>
                            <div className="absolute bottom-[-20%] right-[-10%] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                <Unlock size={160} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Column: Console/History */}
                <div className="col-span-12 lg:col-span-4 h-full pb-8">
                    <div className="bg-neutral-900/60 border border-white/5 rounded-[2.5rem] h-full flex flex-col overflow-hidden backdrop-blur-xl">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Terminal size={20} className="text-orange-500" />
                                <h3 className="font-black text-sm uppercase tracking-widest text-neutral-400">Security Log</h3>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                <div className="w-2 h-2 rounded-full bg-orange-500/50" />
                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                            <div className="space-y-2">
                                {testHistory.length === 0 ? (
                                    <div className="p-8 text-center text-neutral-600 space-y-4">
                                        <p className="text-xs font-bold uppercase tracking-[0.2em]">Awaiting payload execution...</p>
                                    </div>
                                ) : (
                                    testHistory.map((item, i) => (
                                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl animate-in slide-in-from-right duration-300">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-[10px] font-mono text-neutral-500 font-bold">{item.time}</span>
                                                <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded bg-white/5 border border-white/5 ${item.color}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-black uppercase mb-1">Vector: {item.type}</p>
                                            <p className="text-[10px] text-neutral-500 leading-tight">
                                                Identity verification triggered. Handshake failed at authorization dependency layer.
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="p-8 bg-black/40 border-t border-white/5">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield size={14} className="text-neutral-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Node Status: Secure</span>
                            </div>
                            <div className="text-[9px] font-mono text-neutral-700 leading-relaxed uppercase">
                                System detects auth.uid() check on public.Schema. Any unauthorized write will be rejected by Postgres Engine 17.6.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
