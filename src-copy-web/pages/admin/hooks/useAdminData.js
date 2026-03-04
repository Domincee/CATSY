import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../../services/adminService';
import { materialsService } from '../../../services/materialsService';
import { logger } from '../../../utils/logger';
import { useSSE } from '../../../hooks/useSSE';

/**
 * useAdminData — Data Layer Hook (SRP)
 * Owns all server-state for the admin dashboard.
 * Extended to include materials inventory (OCP — no existing logic changed).
 */
export function useAdminData(isLoggedIn = false) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!isLoggedIn) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const [prods, cats, allUsers, mats, rsvps] = await Promise.all([
                adminService.getProducts(),
                adminService.getCategories(),
                adminService.getUsers(),
                materialsService.getAll(),
                adminService.getReservations(),
            ]);
            setProducts(prods || []);
            setCategories(cats || []);
            setUsers(allUsers || []);
            setMaterials(mats || []);
            setReservations(rsvps || []);
        } catch (error) {
            logger.error("Failed to load admin data", error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Real-time: auto-refresh on ANY relevant data change from the server
    useSSE({
        'reservation.updated': loadData,
        'menu.updated': loadData,
        'inventory.updated': loadData,
    });

    const performSave = async (activeTab, currentItem) => {
        if (activeTab === 'products') {
            if (currentItem.product_id) {
                await adminService.updateProduct(currentItem.product_id, currentItem);
            } else {
                await adminService.createProduct(currentItem);
            }
        } else if (activeTab === 'categories') {
            if (currentItem.category_id) {
                await adminService.updateCategory(currentItem.category_id, currentItem);
            } else {
                await adminService.createCategory(currentItem);
            }
        } else if (activeTab === 'accounts') {
            await adminService.createUser(currentItem);
        } else if (activeTab === 'materials') {
            if (currentItem.material_id) {
                await materialsService.update(currentItem.material_id, currentItem);
            } else {
                await materialsService.create(currentItem);
            }
        }
        await loadData();
    };

    const performDelete = async (activeTab, id) => {
        if (activeTab === 'products') {
            await adminService.deleteProduct(id);
        } else if (activeTab === 'categories') {
            await adminService.deleteCategory(id);
        } else if (activeTab === 'accounts') {
            await adminService.deleteUser(id);
        } else if (activeTab === 'materials') {
            await materialsService.delete(id);
        }
        await loadData();
    };

    const updateReservationState = async (id, status) => {
        await adminService.updateReservationStatus(id, status);
        await loadData();
    };

    // Derived: true if any material's stock is at or below its reorder level
    const hasLowStock = materials.some(
        (m) => m.material_reorder_level != null && m.material_stock <= m.material_reorder_level
    );

    return {
        products,
        categories,
        users,
        materials,
        reservations,
        isLoading,
        hasLowStock,
        refreshData: loadData,
        performSave,
        performDelete,
        updateReservationState,
    };
}
