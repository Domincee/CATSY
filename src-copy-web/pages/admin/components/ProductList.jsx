import { Coffee, Plus, SortAsc, SortDesc } from 'lucide-react';
import ProductItem from './ProductItem';

export default function ProductList({
    isLoading,
    sortedAndFilteredProducts,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    sortBy,
    sortOrder,
    toggleSort,
    openCreate,
    openEdit,
    handleDelete
}) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-400">
                        Products ({sortedAndFilteredProducts.length})
                    </h2>
                    <p className="text-sm text-neutral-600 mt-2 uppercase tracking-widest font-bold">Manage your beverage library</p>
                </div>
                <button onClick={openCreate} className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold text-lg transition-all shadow-xl shadow-green-900/20 active:scale-95">
                    <Plus size={22} /> Add New Product
                </button>
            </div>

            {/* CATEGORY FILTER TABS */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-3 border-b border-neutral-800 pb-8">
                    <button
                        onClick={() => setSelectedCategoryId('all')}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all border-2 ${selectedCategoryId === 'all' ? 'bg-white text-neutral-900 border-white shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)]' : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'}`}
                    >
                        All Products
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.category_id}
                            onClick={() => setSelectedCategoryId(cat.category_id)}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all border-2 ${selectedCategoryId === cat.category_id ? 'bg-white text-neutral-900 border-white shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)]' : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                    <button
                        onClick={() => setSelectedCategoryId('uncategorized')}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all border-2 ${selectedCategoryId === 'uncategorized' ? 'bg-red-500 text-white border-red-500 shadow-[0_10px_20px_-5px_rgba(239,68,68,0.3)]' : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'}`}
                    >
                        Uncategorized
                    </button>
                </div>
            )}

            {/* SORTING CONTROLS */}
            <div className="flex items-center gap-8 py-2">
                <div className="flex items-center gap-3">
                    <span className="uppercase tracking-[0.3em] font-black text-white text-[10px] bg-neutral-800 px-3 py-1.5 rounded border border-neutral-700">Sort By</span>
                    <div className="h-px w-12 bg-neutral-800" />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => toggleSort('name')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 font-bold ${sortBy === 'name' ? 'border-brand-accent text-brand-accent bg-brand-accent/5' : 'border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-400'}`}
                    >
                        <span className="text-sm">Product Name</span>
                        {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />)}
                    </button>
                    <button
                        onClick={() => toggleSort('price')}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 font-bold ${sortBy === 'price' ? 'border-brand-accent text-brand-accent bg-brand-accent/5' : 'border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-400'}`}
                    >
                        <span className="text-sm">Price Range</span>
                        {sortBy === 'price' && (sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />)}
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {isLoading ? <div className="text-center py-10 text-neutral-500 flex flex-col items-center gap-4 animate-pulse">
                    <Coffee size={40} className="opacity-20 translate-y-2" />
                    <span>Fetching data...</span>
                </div> :
                    sortedAndFilteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {sortedAndFilteredProducts.map(p => (
                                <ProductItem key={p.product_id} p={p} openEdit={openEdit} handleDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-neutral-800/20 rounded-2xl border border-dashed border-neutral-700/50">
                            <p className="text-neutral-500 font-bold">No products found in this category</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
