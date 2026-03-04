import React, { useState, useEffect } from 'react';
import DebugConsole from '../components/Admin/DebugConsole';
import StatusModal from '../components/UI/StatusModal';
import { useAdminTabs } from '../hooks/useAdminTabs';
import { useAdminData } from './admin/hooks/useAdminData';
import { useUser } from '../context/UserContext';
import { Plus, Loader2 } from 'lucide-react';

// Modular Components
import AdminHeader from './admin/components/AdminHeader';
import ProductList from './admin/components/ProductList';
import CategoryList from './admin/components/CategoryList';
import AccountManager from './admin/components/AccountManager';
import MaterialList from './admin/components/MaterialList';
import AdminForm from './admin/components/AdminForm';
import RedeemPanel from './admin/components/RedeemPanel';
import ReservationManager from './admin/components/ReservationManager';

// Auth handled by parent
import AdminProfile from './admin/components/AdminProfile';

export default function AdminPage() {
    const { isLoggedIn, userInfo, login } = useUser();

    // Data & Logic Hooks
    const { products, categories, users, materials, reservations, isLoading, hasLowStock, refreshData, performSave: hookSave, performDelete: hookDelete, updateReservationState } = useAdminData(isLoggedIn);

    // Tab & Filtering Hooks
    const {
        activeTab,
        selectedCategoryId,
        sortBy,
        sortOrder,
        sortedAndFilteredProducts,
        setActiveTab,
        setSelectedCategoryId,
        toggleSort
    } = useAdminTabs(products, categories);

    // Local UI State
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [statusModal, setStatusModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });
    const [pendingAction, setPendingAction] = useState(null);
    const [processingMessage, setProcessingMessage] = useState('');

    // Sync selectedUser with updated users list (to refresh timestamps)
    useEffect(() => {
        if (selectedUser && users.length > 0) {
            const updatedUser = users.find(u => u.id === selectedUser.id);
            if (updatedUser) {
                // Only update if data actually changed to avoid render loops
                if (JSON.stringify(updatedUser) !== JSON.stringify(selectedUser)) {
                    setSelectedUser(updatedUser);
                }
            }
        }
    }, [users, selectedUser]);

    // --- Actions ---

    const performSave = async () => {
        const entityName = activeTab === 'products' ? 'Product' : activeTab === 'categories' ? 'Category' : activeTab === 'materials' ? 'Material' : 'Account';
        setProcessingMessage(`Saving ${entityName}...`);
        try {
            await hookSave(activeTab, currentItem);

            setIsEditing(false);
            setCurrentItem(null);
            setPendingAction(null);

            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Success!',
                message: `${activeTab === 'products' ? 'Product' : activeTab === 'categories' ? 'Category' : activeTab === 'materials' ? 'Material' : 'Account'} has been saved successfully.`
            });
        } catch (error) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Save Failed',
                message: error.message
            });
        } finally {
            setProcessingMessage('');
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setPendingAction(() => performSave);
        setStatusModal({
            isOpen: true,
            type: 'success',
            title: 'Confirm Save',
            message: `Are you sure you want to save these changes to this ${activeTab === 'products' ? 'product' : activeTab === 'categories' ? 'category' : 'account'}?`
        });
    };

    const performDelete = async (id) => {
        const entityName = activeTab === 'products' ? 'Product' : activeTab === 'categories' ? 'Category' : activeTab === 'materials' ? 'Material' : 'Account';
        setProcessingMessage(`Deleting ${entityName}...`);
        try {
            await hookDelete(activeTab, id);
            setPendingAction(null);
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Deleted',
                message: `${activeTab === 'products' ? 'Product' : 'Category'} has been removed.`
            });
        } catch (error) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Deletion Failed',
                message: error.message
            });
        } finally {
            setProcessingMessage('');
        }
    };

    const handleDelete = (id) => {
        setPendingAction(() => () => performDelete(id));
        setStatusModal({
            isOpen: true,
            type: 'error',
            title: 'Confirm Delete',
            message: `This action cannot be undone. Are you sure you want to delete this ${activeTab === 'products' ? 'product' : 'category'}?`
        });
    };

    const openEdit = (item) => {
        setCurrentItem({ ...item });
        setIsEditing(true);
    };

    const openCreate = () => {
        if (activeTab === 'accounts') {
            setCurrentItem({ first_name: '', last_name: '', email: '', contact: '', role: 'customer', password: '' });
        } else if (activeTab === 'materials') {
            setCurrentItem({ material_name: '', material_unit: 'grams', material_stock: 0, material_reorder_level: '', cost_per_unit: '' });
        } else if (activeTab === 'categories') {
            setCurrentItem({ product_name: '', product_price: '', category_id: categories[0]?.category_id, product_is_available: true, product_is_reward: true });
        } else {
            setCurrentItem(
                activeTab === 'products'
                    ? { product_name: '', product_price: '', category_id: categories[0]?.category_id, product_is_available: true }
                    : { name: '', description: '' }
            );
        }
        setIsEditing(true);
    };

    // Auth handled by App.jsx routing
    // if (!isLoggedIn) return <AdminLogin ... />

    const isAdmin = userInfo?.role === 'admin' || userInfo?.role === 'staff';

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-10">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                        <StatusModal isOpen={true} type="error" title="Access Denied" message="You do not have permission to access the Backstage Admin. Only Staff and Administrators can enter." onClose={() => window.location.href = '/admin'} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-10 pb-40">
            <AdminHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsEditing={setIsEditing}
                setSelectedUser={setSelectedUser}
                hasLowStock={hasLowStock}
            />

            {/* ========== ACCOUNTS TAB ========== */}
            {activeTab === 'accounts' && (
                <AccountManager
                    users={users}
                    isLoading={isLoading}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    loadData={refreshData}
                    onUserUpdated={refreshData}
                    setStatusModal={setStatusModal}
                    openCreate={openCreate}
                    setProcessingMessage={setProcessingMessage}
                />
            )}

            {/* ========== PRODUCTS / CATEGORIES / MATERIALS LISTS ========== */}
            {['products', 'categories', 'materials'].includes(activeTab) && !isEditing && (
                activeTab === 'products' ? (
                    <ProductList
                        isLoading={isLoading}
                        sortedAndFilteredProducts={sortedAndFilteredProducts}
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        setSelectedCategoryId={setSelectedCategoryId}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        toggleSort={toggleSort}
                        openCreate={openCreate}
                        openEdit={openEdit}
                        handleDelete={handleDelete}
                    />
                ) : activeTab === 'materials' ? (
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Raw Materials Inventory</h2>
                            <button
                                onClick={openCreate}
                                className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold text-lg transition-all shadow-xl shadow-green-900/20 active:scale-95"
                            >
                                <Plus size={22} /> Add Material
                            </button>
                        </div>
                        <MaterialList
                            materials={materials}
                            onEdit={openEdit}
                            onDelete={(id) => hookDelete('materials', id).then(refreshData)}
                            onRefresh={refreshData}
                            setProcessingMessage={setProcessingMessage}
                        />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProductList
                            isLoading={isLoading}
                            sortedAndFilteredProducts={products.filter(p => p.product_is_reward)}
                            categories={[]} // Hide category filter tabs
                            selectedCategoryId={'all'}
                            setSelectedCategoryId={() => { }} // No-op
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            toggleSort={toggleSort}
                            openCreate={openCreate}
                            openEdit={(item) => {
                                setActiveTab('products');
                                openEdit(item);
                            }}
                            handleDelete={(id) => hookDelete('products', id).then(refreshData)}
                        />
                    </div>
                )
            )}

            <AdminForm
                activeTab={activeTab}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                categories={categories}
                materials={materials}
                products={products}
                handleSave={handleSave}
                setProcessingMessage={setProcessingMessage}
            />

            {/* ========== PROFILE TAB ========== */}
            {activeTab === 'profile' && (
                <AdminProfile
                    userInfo={userInfo}
                    setStatusModal={setStatusModal}
                    setProcessingMessage={setProcessingMessage}
                />
            )}

            {/* ========== LOYALTY TAB ========== */}
            {activeTab === 'loyalty' && (
                <RedeemPanel setProcessingMessage={setProcessingMessage} />
            )}

            {/* ========== RESERVATIONS TAB ========== */}
            {activeTab === 'reservations' && (
                <ReservationManager
                    reservations={reservations}
                    updateReservationState={updateReservationState}
                    isLoading={isLoading}
                    setProcessingMessage={setProcessingMessage}
                />
            )}

            <DebugConsole />

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={() => {
                    setStatusModal({ ...statusModal, isOpen: false });
                    setPendingAction(null);
                }}
                onConfirm={pendingAction ? () => {
                    pendingAction();
                    setStatusModal({ ...statusModal, isOpen: false });
                } : null}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                confirmLabel={statusModal.title.includes('Delete') ? "Delete" : "Confirm"}
            />

            {/* ========== GLOBAL PROCESSING OVERLAY ========== */}
            {processingMessage && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-neutral-900 border border-neutral-700/50 p-8 rounded-3xl flex flex-col items-center gap-5 shadow-2xl animate-in zoom-in-95 duration-300">
                        <Loader2 size={48} className="text-brand-accent animate-spin" />
                        <p className="text-white font-bold text-xl">{processingMessage}</p>
                        <p className="text-neutral-400 text-sm">Please do not close this window</p>
                    </div>
                </div>
            )}
        </div>
    );
}
