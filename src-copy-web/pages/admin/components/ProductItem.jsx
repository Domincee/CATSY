import { Edit, Trash2 } from 'lucide-react';

export default function ProductItem({ p, openEdit, handleDelete }) {
    return (
        <div className="bg-neutral-800 p-6 rounded-2xl flex justify-between items-center border border-neutral-700/50 hover:border-neutral-600 transition-colors group">
            <div>
                <h4 className="font-bold text-xl group-hover:text-brand-accent transition-colors">{p.product_name}</h4>
                <div className="flex flex-wrap gap-3 text-base text-neutral-400 mt-2">
                    <span className="text-green-400 font-mono font-bold">₱{p.product_price}</span>
                    <span className="opacity-44">•</span>
                    {!p.product_is_available && <span className="text-red-400 bg-red-900/30 px-3 py-1 rounded text-xs items-center flex font-bold uppercase tracking-widest">Unavailable</span>}
                    {p.product_is_featured && <span className="text-yellow-400 bg-yellow-900/30 px-3 py-1 rounded text-xs items-center flex font-bold uppercase tracking-widest">Featured</span>}
                    {p.product_is_eligible && <span className="text-amber-400 bg-amber-900/30 px-3 py-1 rounded text-xs items-center flex font-bold uppercase tracking-widest">+1 Stamp</span>}
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={() => openEdit(p)} className="p-3 hover:bg-neutral-700 rounded-xl text-blue-400 transition-colors" title="Edit Product"><Edit size={22} /></button>
                <button onClick={() => handleDelete(p.product_id)} className="p-3 hover:bg-neutral-700 rounded-xl text-red-400 transition-colors" title="Delete Product"><Trash2 size={22} /></button>
            </div>
        </div>
    );
}
