import { Edit, Trash2, Plus, Coffee } from 'lucide-react';

export default function CategoryList({ categories, isLoading, openEdit, handleDelete, openCreate }) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-400">
                        Claimable Rewards ({categories.length})
                    </h2>
                </div>
                <button onClick={openCreate} className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold text-lg transition-all shadow-xl shadow-green-900/20 active:scale-95">
                    <Plus size={22} /> Add Reward Category
                </button>
            </div>

            <div className="grid gap-4">
                {isLoading ? <div className="text-center py-10 text-neutral-500 flex flex-col items-center gap-4 animate-pulse">
                    <Coffee size={40} className="opacity-20 translate-y-2" />
                    <span>Fetching data...</span>
                </div> :
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {categories.map(c => (
                            <div key={c.category_id} className="bg-neutral-800 p-6 rounded-2xl flex justify-between items-center border border-neutral-700/50 hover:border-neutral-600 transition-colors group h-full">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className="font-bold text-xl group-hover:text-brand-accent transition-colors truncate">{c.name}</h3>
                                    {c.products?.product_name && (
                                        <p className="text-sm text-green-400 font-bold mt-1">Reward: {c.products.product_name}</p>
                                    )}
                                    <p className="text-base text-neutral-500 mt-2 line-clamp-2 h-12">{c.description || 'No description'}</p>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    <button onClick={() => openEdit(c)} className="p-3 hover:bg-neutral-700 rounded-xl text-blue-400 transition-colors" title="Edit Category"><Edit size={22} /></button>
                                    <button onClick={() => handleDelete(c.category_id)} className="p-3 hover:bg-neutral-700 rounded-xl text-red-400 transition-colors" title="Delete Category"><Trash2 size={22} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}
