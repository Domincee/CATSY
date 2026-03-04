import { Save, X, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import RecipeEditor from './RecipeEditor';

const UNITS = ['grams', 'ml', 'pcs', 'kg', 'liters', 'oz', 'tbsp', 'tsp'];

export default function AdminForm({ activeTab, isEditing, setIsEditing, currentItem, setCurrentItem, categories, materials = [], products = [], handleSave, setProcessingMessage }) {
    // Local UI states
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    // Password strength state (for account creation only)
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: 'Weak',
        color: 'bg-red-500',
        feedback: []
    });

    // Calculate password strength in real-time
    useEffect(() => {
        if (activeTab !== 'accounts' || !currentItem?.password) {
            setPasswordStrength({ score: 0, label: 'Weak', color: 'bg-red-500', feedback: [] });
            return;
        }

        const p = currentItem.password;
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
    }, [currentItem?.password, activeTab]);

    if (!isEditing) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-3xl bg-neutral-800 p-8 md:p-10 rounded-[2.5rem] border border-neutral-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-neutral-800 z-10 pb-4 border-b border-neutral-700/50">
                    <h2 className="text-3xl font-bold">{currentItem.product_id || currentItem.category_id || currentItem.material_id ? 'Edit' : 'Create'} {activeTab === 'products' ? 'Product' : activeTab === 'categories' ? 'Claimable Reward' : activeTab === 'materials' ? 'Material' : 'Account'}</h2>
                    <button onClick={() => setIsEditing(false)} className="text-neutral-400 hover:text-white transition-colors"><X size={32} /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {activeTab === 'products' ? (
                        <>
                            <div>
                                <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Product Name</label>
                                <input
                                    type="text"
                                    value={currentItem.product_name}
                                    onChange={e => setCurrentItem({ ...currentItem, product_name: e.target.value })}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Price (₱)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={currentItem.product_price}
                                        onChange={e => setCurrentItem({ ...currentItem, product_price: parseFloat(e.target.value) })}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Category</label>
                                    <select
                                        value={currentItem.category_id}
                                        onChange={e => setCurrentItem({ ...currentItem, category_id: parseInt(e.target.value) })}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c.category_id} value={c.category_id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-10 py-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={currentItem.product_is_available} onChange={e => setCurrentItem({ ...currentItem, product_is_available: e.target.checked })} className="accent-green-500 w-6 h-6" />
                                    <span className="text-xl text-neutral-300 group-hover:text-white transition-colors font-sans font-bold">Available</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={currentItem.product_is_featured} onChange={e => setCurrentItem({ ...currentItem, product_is_featured: e.target.checked })} className="accent-yellow-500 w-6 h-6" />
                                    <span className="text-xl text-neutral-300 group-hover:text-white transition-colors font-sans font-bold">Featured</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={currentItem.product_is_eligible} onChange={e => setCurrentItem({ ...currentItem, product_is_eligible: e.target.checked })} className="accent-blue-500 w-6 h-6" />
                                    <span className="text-xl text-neutral-300 group-hover:text-white transition-colors font-sans font-bold">+1 Stamp</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={currentItem.product_is_reward} onChange={e => setCurrentItem({ ...currentItem, product_is_reward: e.target.checked })} className="accent-purple-500 w-6 h-6" />
                                    <span className="text-xl text-neutral-300 group-hover:text-white transition-colors font-sans font-bold">Claimable Reward</span>
                                </label>
                            </div>
                            {/* Recipe Editor — only for existing products */}
                            {currentItem.product_id ? (
                                <RecipeEditor
                                    productId={currentItem.product_id}
                                    productPrice={currentItem.product_price}
                                    materials={materials}
                                    setProcessingMessage={setProcessingMessage}
                                />
                            ) : (
                                <p className="text-sm text-amber-400/80 bg-amber-500/10 px-4 py-3 rounded-xl border border-amber-500/20">
                                    💡 Save this product first to add a recipe.
                                </p>
                            )}
                        </>
                    ) : activeTab === 'categories' ? (
                        <>
                            <div>
                                <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Reward Name</label>
                                <input
                                    type="text"
                                    value={currentItem.name}
                                    onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Description</label>
                                <textarea
                                    value={currentItem.description || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors resize-none font-sans"
                                    rows={4}
                                    placeholder="Optional description..."
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Linked Product (Optional)</label>
                                <select
                                    value={currentItem.linked_product_id || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, linked_product_id: parseInt(e.target.value) || null })}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                >
                                    <option value="">None (Standalone Category/Reward)</option>
                                    {products.map(p => (
                                        <option key={p.product_id} value={p.product_id}>{p.product_name}</option>
                                    ))}
                                </select>
                                <p className="text-sm text-neutral-500 mt-2">Linking a product allows this to be redeemed as a free drink reward.</p>
                            </div>
                        </>
                    ) : activeTab === 'materials' ? (
                        <>
                            <div>
                                <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Material Name</label>
                                <input
                                    type="text"
                                    value={currentItem.material_name || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, material_name: e.target.value })}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Unit</label>
                                    <select
                                        value={currentItem.material_unit || 'grams'}
                                        onChange={e => setCurrentItem({ ...currentItem, material_unit: e.target.value })}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                        required
                                    >
                                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Cost per Unit (₱)</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        min="0"
                                        value={currentItem.cost_per_unit ?? ''}
                                        onChange={e => setCurrentItem({ ...currentItem, cost_per_unit: e.target.value ? parseFloat(e.target.value) : null })}
                                        placeholder="e.g. 0.0500"
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Current Stock</label>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        value={currentItem.material_stock ?? 0}
                                        onChange={e => setCurrentItem({ ...currentItem, material_stock: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Reorder Level <span className="text-neutral-600">(Optional)</span></label>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        value={currentItem.material_reorder_level ?? ''}
                                        onChange={e => setCurrentItem({ ...currentItem, material_reorder_level: e.target.value ? parseFloat(e.target.value) : null })}
                                        placeholder="Alert threshold..."
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        // User Creation Form
                        <>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">First Name</label>
                                    <input
                                        type="text"
                                        value={currentItem.first_name}
                                        onChange={e => setCurrentItem({ ...currentItem, first_name: e.target.value })}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Last Name</label>
                                    <input
                                        type="text"
                                        value={currentItem.last_name}
                                        onChange={e => setCurrentItem({ ...currentItem, last_name: e.target.value })}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Email Address</label>
                                <input
                                    type="email"
                                    value={currentItem.email}
                                    onChange={e => setCurrentItem({ ...currentItem, email: e.target.value })}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Contact Number <span className="text-neutral-600">(Optional)</span></label>
                                    <input
                                        type="tel"
                                        value={currentItem.contact}
                                        onChange={e => setCurrentItem({ ...currentItem, contact: e.target.value })}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Role</label>
                                    <select
                                        value={currentItem.role}
                                        onChange={e => setCurrentItem({ ...currentItem, role: e.target.value })}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors capitalize font-sans"
                                        required
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="staff">Staff</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={currentItem.password}
                                            onChange={e => setCurrentItem({ ...currentItem, password: e.target.value })}
                                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-5 py-4 text-xl focus:outline-none focus:border-green-500 transition-colors font-sans"
                                            minLength={8}
                                            required
                                            placeholder="Set initial password..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg font-bold text-neutral-400 mb-3 uppercase tracking-wider font-sans">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className={`w-full bg-neutral-900 border rounded-xl px-5 py-4 text-xl focus:outline-none transition-colors font-sans
                                                ${confirmPassword
                                                    ? (confirmPassword === currentItem.password ? 'border-green-500/50 focus:border-green-500' : 'border-red-500/50 focus:border-red-500')
                                                    : 'border-neutral-700 focus:border-green-500'
                                                }`}
                                            required
                                            placeholder="Repeat password..."
                                        />
                                        {confirmPassword && (
                                            <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                                {confirmPassword === currentItem.password
                                                    ? <span className="text-green-500 text-sm font-bold uppercase font-sans">Match</span>
                                                    : <span className="text-red-500 text-sm font-bold uppercase font-sans">Mismatch</span>
                                                }
                                            </div>
                                        )}
                                    </div>
                                    {confirmPassword && confirmPassword !== currentItem.password && (
                                        <p className="mt-2 text-base text-red-500 font-sans">Passwords do not match.</p>
                                    )}
                                </div>
                            </div>

                            {/* Full-width Password Strength Indicator */}
                            {currentItem.password && (
                                <div className="mt-6 p-6 bg-black/20 rounded-[2rem] border border-neutral-700/50 space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <span className={`text-sm font-black uppercase tracking-widest font-sans ${passwordStrength.color.replace('bg-', 'text-')}`}>
                                            Security Level: {passwordStrength.label}
                                        </span>
                                        <span className="text-neutral-500 text-xs font-bold uppercase font-sans">
                                            {passwordStrength.score}/5 Required
                                        </span>
                                    </div>

                                    <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-700 ease-out ${passwordStrength.color} shadow-[0_0_10px_rgba(34,197,94,0.3)]`}
                                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 pt-2">
                                        {passwordStrength.feedback.map(req => (
                                            <div key={req.id} className="flex items-center gap-3 group transition-all">
                                                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${req.met ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-neutral-700'}`} />
                                                <span className={`text-base font-bold transition-colors duration-300 font-sans ${req.met ? 'text-white' : 'text-neutral-500'}`}>
                                                    {req.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex justify-end gap-6 mt-12">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-10 py-5 rounded-2xl font-bold text-xl text-neutral-400 hover:bg-neutral-800 transition-colors font-sans">Cancel</button>
                        <button
                            type="submit"
                            disabled={activeTab === 'accounts' && !currentItem.id && (passwordStrength.score < 5 || confirmPassword !== currentItem.password)}
                            className={`px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-green-900/20 active:scale-95 transition-all flex items-center gap-3 font-sans
                                ${activeTab === 'accounts' && !currentItem.id && (passwordStrength.score < 5 || confirmPassword !== currentItem.password)
                                    ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed opacity-50'
                                    : 'bg-green-600 hover:bg-green-500 text-white'}`}
                        >
                            <Save size={24} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
