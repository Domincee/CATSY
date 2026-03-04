import { useState, useEffect, useCallback } from 'react';
import { Plus, X, Save, ChefHat, AlertTriangle, TrendingUp, Loader } from 'lucide-react';
import { materialsService } from '../../../services/materialsService';
import { logger } from '../../../utils/logger';

/**
 * RecipeEditor — Presentation Layer (SRP)
 * Manages ingredient rows for a single product's recipe.
 * Receives `materials` from parent (DIP — depends on abstraction, not fetch).
 */
export default function RecipeEditor({ productId, productPrice = 0, materials = [], setProcessingMessage }) {
    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Searchable combobox state per row
    const [searchTerms, setSearchTerms] = useState({});
    const [openDropdown, setOpenDropdown] = useState(null);

    /* ── Load existing recipe ── */
    const loadRecipe = useCallback(async () => {
        if (!productId) return;
        setIsLoading(true);
        try {
            const data = await materialsService.getRecipe(productId);
            const rows = (data || []).map(r => ({
                material_id: r.material_id,
                quantity_required: r.quantity_required,
                material_name: r.raw_materials_inventory?.material_name ?? '',
                material_unit: r.raw_materials_inventory?.material_unit ?? '',
                cost_per_unit: r.raw_materials_inventory?.cost_per_unit ?? 0,
            }));
            setIngredients(rows);
            setSearchTerms(
                rows.reduce((acc, r) => ({ ...acc, [r.material_id]: r.material_name }), {})
            );
        } catch (err) {
            logger.error('RecipeEditor: Failed to load recipe', err);
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => { loadRecipe(); }, [loadRecipe]);

    /* ── Derived: Cost & Margin ── */
    const totalCost = ingredients.reduce(
        (sum, ing) => sum + (ing.quantity_required || 0) * (ing.cost_per_unit || 0), 0
    );
    const margin = productPrice > 0 ? ((productPrice - totalCost) / productPrice) * 100 : null;
    const marginColor = margin === null ? 'text-neutral-500'
        : margin >= 60 ? 'text-green-400'
            : margin >= 30 ? 'text-amber-400'
                : 'text-red-400';

    /* ── Row manipulation ── */
    const addRow = () => {
        setIngredients(prev => [...prev, { material_id: null, quantity_required: 1, material_name: '', material_unit: '', cost_per_unit: 0 }]);
    };

    const removeRow = (index) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };

    const updateRow = (index, field, value) => {
        setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, [field]: value } : ing));
    };

    const selectMaterial = (index, mat) => {
        updateRow(index, 'material_id', mat.material_id);
        updateRow(index, 'material_name', mat.material_name);
        updateRow(index, 'material_unit', mat.material_unit);
        updateRow(index, 'cost_per_unit', mat.cost_per_unit ?? 0);
        setSearchTerms(prev => ({ ...prev, [index]: mat.material_name }));
        setOpenDropdown(null);
    };

    /* ── Save ── */
    const handleSave = async () => {
        const validRows = ingredients.filter(ing => ing.material_id && ing.quantity_required > 0);
        setIsSaving(true);
        if (setProcessingMessage) setProcessingMessage('Saving Recipe...');
        setError('');
        try {
            await materialsService.upsertRecipe(productId, validRows.map(r => ({
                material_id: r.material_id,
                quantity_required: r.quantity_required,
            })));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            await loadRecipe();
        } catch (err) {
            setError('Failed to save recipe. Please try again.');
            logger.error('RecipeEditor: Save failed', err);
        } finally {
            setIsSaving(false);
            if (setProcessingMessage) setProcessingMessage('');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8 text-neutral-500">
                <Loader size={20} className="animate-spin mr-2" /> Loading recipe...
            </div>
        );
    }

    return (
        <div className="mt-8 border-t border-neutral-700/50 pt-8 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ChefHat size={20} className="text-brand-accent" />
                    <h3 className="text-xl font-bold text-white">Recipe</h3>
                    {ingredients.length === 0 && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold uppercase tracking-wider">
                            <AlertTriangle size={12} /> Incomplete
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={addRow}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-bold transition-all"
                >
                    <Plus size={16} /> Add Ingredient
                </button>
            </div>

            {/* Ingredient Rows */}
            {ingredients.length > 0 && (
                <div className="space-y-2">
                    {/* Column Headers */}
                    <div className="grid grid-cols-[1fr_120px_80px_32px] gap-3 px-1">
                        {['Ingredient', 'Quantity', 'Unit', ''].map(h => (
                            <span key={h} className="text-xs font-black uppercase tracking-widest text-neutral-600">{h}</span>
                        ))}
                    </div>

                    {ingredients.map((ing, index) => {
                        const term = searchTerms[index] ?? ing.material_name ?? '';
                        const filtered = materials.filter(m =>
                            m.material_name.toLowerCase().includes(term.toLowerCase())
                        );
                        const isOpen = openDropdown === index;

                        return (
                            <div key={index} className="grid grid-cols-[1fr_120px_80px_32px] gap-3 items-center">
                                {/* Searchable Ingredient Combobox */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Type to search ingredient..."
                                        value={term}
                                        onChange={e => {
                                            setSearchTerms(prev => ({ ...prev, [index]: e.target.value }));
                                            setOpenDropdown(index);
                                        }}
                                        onFocus={() => setOpenDropdown(index)}
                                        onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                                    />
                                    {isOpen && filtered.length > 0 && (
                                        <ul className="absolute z-50 mt-1 w-full bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                                            {filtered.map(mat => (
                                                <li
                                                    key={mat.material_id}
                                                    onMouseDown={() => selectMaterial(index, mat)}
                                                    className="px-4 py-2.5 text-sm text-white hover:bg-neutral-700 cursor-pointer transition-colors flex justify-between items-center"
                                                >
                                                    <span>{mat.material_name}</span>
                                                    <span className="text-neutral-500 text-xs">{mat.material_unit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Quantity */}
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={ing.quantity_required}
                                    onChange={e => updateRow(index, 'quantity_required', parseFloat(e.target.value) || 0)}
                                    className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-3 text-sm text-white text-center focus:outline-none focus:border-green-500 transition-colors"
                                />

                                {/* Unit — Read-only */}
                                <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-xl px-3 py-3 text-sm text-neutral-400 text-center font-mono">
                                    {ing.material_unit || '—'}
                                </div>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Cost Summary */}
            {ingredients.length > 0 && (
                <div className="p-5 rounded-2xl bg-black/30 border border-neutral-700/40 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider">Total Cost</span>
                        <span className="text-white font-mono font-bold">₱{totalCost.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider">Selling Price</span>
                        <span className="text-white font-mono font-bold">₱{Number(productPrice).toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-neutral-700/50" />
                    <div className="flex justify-between items-center">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                            <TrendingUp size={14} /> Margin
                        </span>
                        <span className={`font-mono font-black text-lg ${marginColor}`}>
                            {margin !== null ? `${margin.toFixed(1)}%` : '—'}
                        </span>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all
                        ${saved ? 'bg-green-600 text-white' : isSaving ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600 text-white'}`}
                >
                    {isSaving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                    {saved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Recipe'}
                </button>
            </div>
        </div>
    );
}
