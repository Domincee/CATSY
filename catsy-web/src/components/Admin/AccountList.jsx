import React, { useState } from 'react';
import { Users, Shield, UserCheck, User, Plus } from 'lucide-react';

const getRoleBadge = (role) => {
    const styles = {
        admin: 'bg-red-500/20 text-red-400 border-red-500/30',
        staff: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        customer: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return styles[role] || styles.customer;
};

const getRoleIcon = (role) => {
    if (role === 'admin') return <Shield size={18} />;
    if (role === 'staff') return <UserCheck size={18} />;
    return <User size={18} />;
};

export default function AccountList({ users, isLoading, onSelectUser, onCreate }) {
    const [roleFilter, setRoleFilter] = useState('all');

    const filteredUsers = roleFilter === 'all'
        ? users
        : users.filter(u => u.role === roleFilter);

    const roleCounts = {
        all: users.length,
        customer: users.filter(u => u.role === 'customer').length,
        staff: users.filter(u => u.role === 'staff').length,
        admin: users.filter(u => u.role === 'admin').length
    };

    return (
        <div className="space-y-8">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-400">
                        Accounts ({users.length})
                    </h2>
                    <p className="text-sm text-neutral-600 mt-2 uppercase tracking-widest font-bold">Manage user access and roles</p>
                </div>
                <button
                    onClick={onCreate}
                    className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold text-lg transition-all shadow-xl shadow-green-900/20 active:scale-95"
                >
                    <Plus size={22} /> Create Account
                </button>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex gap-3 flex-wrap border-b border-neutral-800 pb-8">
                {['all', 'customer', 'staff', 'admin'].map(role => (
                    <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all border-2 flex items-center gap-2.5
                            ${roleFilter === role
                                ? 'bg-white text-neutral-900 border-white shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)]'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                            }`}
                    >
                        {role === 'all' ? <Users size={18} /> : getRoleIcon(role)}
                        {role.charAt(0).toUpperCase() + role.slice(1)} ({roleCounts[role]})
                    </button>
                ))}
            </div>

            {/* User List */}
            {isLoading ? (
                <div className="text-center py-10 text-xl text-neutral-500">Loading accounts...</div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-xl text-neutral-500">No {roleFilter} accounts found.</div>
            ) : (
                <div className="grid gap-4">
                    {filteredUsers.map(user => (
                        <div
                            key={user.id}
                            onClick={() => onSelectUser(user)}
                            className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700/50 hover:border-neutral-500 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <h3 className="font-bold text-xl group-hover:text-white transition-colors">
                                            {user.first_name} {user.last_name}
                                        </h3>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full border capitalize flex items-center gap-2 ${getRoleBadge(user.role)}`}>
                                            {getRoleIcon(user.role)}
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-base text-neutral-400">
                                        <span>{user.email}</span>
                                        {user.contact && <span>• {user.contact}</span>}
                                    </div>
                                </div>
                                <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors text-lg">→</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
