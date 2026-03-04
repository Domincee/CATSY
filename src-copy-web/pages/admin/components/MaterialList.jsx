import { useState, useCallback } from 'react';
import { Pencil, Trash2, Plus, Check, X, AlertTriangle } from 'lucide-react';
import { materialsService } from '../../../services/materialsService';
import StatusModal from '../../../components/UI/StatusModal';
import { logger } from '../../../utils/logger';

const UNITS = ['grams', 'ml', 'pcs', 'kg', 'liters', 'oz', 'tbsp', 'tsp'];

/**
 * MaterialList — Presentation Layer (SRP)
 * Owns only the display and inline interactions of the materials table.
 * Calls onEdit / onDelete for state mutations delegated to useAdminData.
 */
export default function MaterialList({ materials, onEdit, onDelete, onRefresh, setProcessingMessage }) {
    // Inline stock editing state: { id: number, value: string } | null
    const [editingStock, setEditingStock] = useState(null);
    const [savingId, setSavingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    /* ── Inline Stock Save ── */
    const saveStock = useCallback(async (material) => {
        if (editingStock === null) return;
        const newStock = parseFloat(editingStock.value);
        if (isNaN(newStock) || newStock < 0) {
            setEditingStock(null);
            return;
        }
        setSavingId(material.material_id);
        if (setProcessingMessage) setProcessingMessage('Updating Stock...');
        try {
            await materialsService.update(material.material_id, { material_stock: newStock });
            onRefresh();
        } catch (err) {
            logger.error('Failed to update stock', err);
            setSavingId(null);
            setEditingStock(null);
            if (setProcessingMessage) setProcessingMessage('');
        }
    }, [editingStock, onRefresh, setProcessingMessage]);

    /* ── Unit-Change Guard ── */
    const handleUnitEditGuard = async (material) => {
        if (setProcessingMessage) setProcessingMessage('Checking dependencies...');
        try {
            const check = await materialsService.checkInUse(material.material_id).catch(() => ({ in_use: false }));
            if (setProcessingMessage) setProcessingMessage('');

            if (check.in_use) {
                setConfirmModal({
                    isOpen: true,
                    title: 'Unit Change Warning',
                    message: `"${material.material_name}" is used in existing recipes. Changing the unit may make existing quantities incorrect. Proceed?`,
                    confirmLabel: 'Change Unit Anyway',
                    onConfirm: () => {
                        setConfirmModal({ isOpen: false });
                        onEdit(material);
                    },
                });
            } else {
                onEdit(material);
            }
        } catch (err) {
            if (setProcessingMessage) setProcessingMessage('');
            onEdit(material);
        }
    };

    /* ── Delete Guard ── */
    const handleDelete = (material) => {
        setConfirmModal({
            isOpen: true,
            type: 'error',
            title: 'Delete Material',
            message: `Delete "${material.material_name}"? If it's in any recipe those rows will be removed too.`,
            confirmLabel: 'Delete',
            onConfirm: () => {
                setConfirmModal({ isOpen: false });
                onDelete(material.material_id);
            },
        });
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-neutral-700/60">
                            {['Material', 'Unit', 'Stock', 'Reorder Level', 'Cost/Unit', 'Actions'].map(h => (
                                <th key={h} className="pb-4 text-xs font-black uppercase tracking-widest text-neutral-500 pr-6">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {materials.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-16 text-center text-neutral-600 text-lg">
                                    No materials yet. Add your first ingredient.
                                </td>
                            </tr>
                        )}
                        {materials.map((m) => {
                            const isLow = m.material_reorder_level != null && m.material_stock <= m.material_reorder_level;
                            const isEditingThisStock = editingStock?.id === m.material_id;

                            return (
                                <tr
                                    key={m.material_id}
                                    className={`border-b transition-colors ${isLow ? 'border-amber-500/20 bg-amber-500/5' : 'border-neutral-800'}`}
                                >
                                    {/* Material Name */}
                                    <td className="py-4 pr-6">
                                        <div className="flex items-center gap-2">
                                            {isLow && <AlertTriangle size={14} className="text-amber-400 shrink-0" />}
                                            <span className="font-semibold text-white">{m.material_name}</span>
                                        </div>
                                    </td>

                                    {/* Unit */}
                                    <td className="py-4 pr-6">
                                        <span className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-400 text-sm font-bold">
                                            {m.material_unit}
                                        </span>
                                    </td>

                                    {/* Stock — Inline Editable */}
                                    <td className="py-4 pr-6">
                                        {isEditingThisStock ? (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setEditingStock(prev => ({ ...prev, value: String(Math.max(0, parseFloat(prev.value || 0) - 1)) }))}
                                                    className="w-7 h-7 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-lg transition-colors flex items-center justify-center"
                                                >−</button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="any"
                                                    value={editingStock.value}
                                                    onChange={e => setEditingStock(prev => ({ ...prev, value: e.target.value }))}
                                                    onKeyDown={e => { if (e.key === 'Enter') saveStock(m); if (e.key === 'Escape') setEditingStock(null); }}
                                                    className="w-20 bg-neutral-900 border border-green-500 rounded-lg px-2 py-1 text-center text-white text-sm focus:outline-none"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => setEditingStock(prev => ({ ...prev, value: String(parseFloat(prev.value || 0) + 1) }))}
                                                    className="w-7 h-7 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-lg transition-colors flex items-center justify-center"
                                                >+</button>
                                                <button onClick={() => saveStock(m)} className="ml-1 text-green-400 hover:text-green-300"><Check size={16} /></button>
                                                <button onClick={() => setEditingStock(null)} className="text-neutral-500 hover:text-white"><X size={16} /></button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setEditingStock({ id: m.material_id, value: String(m.material_stock ?? 0) })}
                                                className={`text-sm font-bold hover:underline transition-colors ${isLow ? 'text-amber-400' : 'text-white'}`}
                                                title="Click to edit stock"
                                            >
                                                {savingId === m.material_id ? '...' : (m.material_stock ?? 0)}
                                            </button>
                                        )}
                                    </td>

                                    {/* Reorder Level */}
                                    <td className="py-4 pr-6 text-neutral-400 text-sm">
                                        {m.material_reorder_level ?? <span className="text-neutral-700">—</span>}
                                    </td>

                                    {/* Cost per Unit */}
                                    <td className="py-4 pr-6 text-neutral-300 text-sm font-mono">
                                        {m.cost_per_unit != null ? `₱${Number(m.cost_per_unit).toFixed(4)}` : <span className="text-neutral-700">—</span>}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleUnitEditGuard(m)}
                                                className="p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-700 transition-all"
                                                title="Edit material"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(m)}
                                                className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                                title="Delete material"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <StatusModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                type={confirmModal.type || 'error'}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                confirmLabel={confirmModal.confirmLabel}
                closeLabel="Cancel"
            />
        </>
    );
}
