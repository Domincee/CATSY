import { useState } from 'react';
import { Coffee, LayoutGrid, Users, LogOut, FlaskConical, Gift, BookOpen } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import StatusModal from '../../../components/UI/StatusModal';

export default function AdminHeader({ activeTab, setActiveTab, setIsEditing, setSelectedUser, hasLowStock = false }) {
    const { logout } = useUser();
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'info', title: '', message: '', onConfirm: null });

    const handleLogoutClick = () => {
        setStatusModal({
            isOpen: true,
            type: 'error',
            title: 'Sign Out',
            message: 'Are you sure you want to sign out?',
            confirmLabel: 'Sign Out',
            onConfirm: confirmLogout,
            closeLabel: 'Cancel'
        });
    };

    const confirmLogout = () => {
        // Show success state
        setStatusModal({
            isOpen: true,
            type: 'success',
            title: 'Signed Out',
            message: 'You have been successfully signed out.',
            onConfirm: null, // removing onConfirm hides the buttons (if StatusModal handles it, or we can just let it sit there)
            closeLabel: '' // Hide close button text if possible, or we rely on the timeout
        });

        setTimeout(() => {
            logout();
            // Redirect happens automatically via UserContext/App.jsx
        }, 1500);
    };

    return (
        <>
            <header className="mb-12 flex justify-between items-center">
                <h1 className="text-4xl font-bold font-display text-brand-accent text-white">Backstage Admin</h1>

                <div className="flex items-center gap-6">
                    <div className="flex gap-2 bg-neutral-800/50 p-1.5 rounded-xl border border-neutral-700/50">
                        <button
                            onClick={() => { setActiveTab('products'); setIsEditing(false); setSelectedUser(null); }}
                            className={`px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 font-bold text-lg ${activeTab === 'products' ? 'bg-neutral-700 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <Coffee size={20} /> Products
                        </button>
                        <button
                            onClick={() => { setActiveTab('categories'); setIsEditing(false); setSelectedUser(null); }}
                            className={`px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 font-bold text-lg ${activeTab === 'categories' ? 'bg-neutral-700 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <LayoutGrid size={20} /> Claimable Rewards
                        </button>
                        <button
                            onClick={() => { setActiveTab('materials'); setIsEditing(false); setSelectedUser(null); }}
                            className={`px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 font-bold text-lg ${activeTab === 'materials' ? 'bg-neutral-700 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <FlaskConical size={20} />
                            <span className="relative">
                                Inventory
                                {hasLowStock && (
                                    <span className="absolute -top-1 -right-3 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
                                )}
                            </span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('accounts'); setIsEditing(false); setSelectedUser(null); }}
                            className={`px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 font-bold text-lg ${activeTab === 'accounts' ? 'bg-neutral-700 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <Users size={20} /> Accounts
                        </button>
                        <button
                            onClick={() => { setActiveTab('reservations'); setIsEditing(false); setSelectedUser(null); }}
                            className={`px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 font-bold text-lg ${activeTab === 'reservations' ? 'bg-neutral-700 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <BookOpen size={20} /> Reservations
                        </button>
                        <button
                            onClick={() => { setActiveTab('loyalty'); setIsEditing(false); setSelectedUser(null); }}
                            className={`px-6 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 font-bold text-lg ${activeTab === 'loyalty' ? 'bg-neutral-700 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <Gift size={20} /> Loyalty
                        </button>
                    </div>

                    <button
                        onClick={() => { setActiveTab('profile'); setIsEditing(false); setSelectedUser(null); }}
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${activeTab === 'profile' ? 'border-brand-accent bg-brand-accent/10 text-brand-accent shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'}`}
                        title="My Profile"
                    >
                        <Users size={20} />
                    </button>

                    <div className="w-px h-8 bg-neutral-800 mx-2"></div>

                    <button
                        onClick={handleLogoutClick}
                        className="p-3 text-neutral-400 hover:text-red-500 hover:bg-neutral-800 rounded-xl transition-all"
                        title="Logout Admin"
                    >
                        <LogOut size={24} />
                    </button>
                </div>
            </header>

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onConfirm={statusModal.onConfirm}
                confirmLabel={statusModal.confirmLabel}
                closeLabel={statusModal.closeLabel}
            />
        </>
    );
}
