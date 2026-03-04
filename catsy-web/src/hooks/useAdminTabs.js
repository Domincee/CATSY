import { useState, useMemo } from 'react';
import { processAdminProducts } from '../utils/adminUtils';

/**
 * Custom hook to manage Admin Page selection state and logic.
 */
export const useAdminTabs = (products, categories) => {
    const [activeTab, setActiveTab] = useState('products');
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Memoized processing results
    const sortedAndFilteredProducts = useMemo(() => {
        return processAdminProducts(products, selectedCategoryId, categories, sortBy, sortOrder);
    }, [products, selectedCategoryId, categories, sortBy, sortOrder]);

    const toggleSort = (type) => {
        if (sortBy === type) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(type);
            setSortOrder('asc');
        }
    };

    const changeTab = (tab) => {
        setActiveTab(tab);
        // We could reset other filters here if desired
    };

    return {
        activeTab,
        selectedCategoryId,
        sortBy,
        sortOrder,
        sortedAndFilteredProducts,
        setActiveTab: changeTab,
        setSelectedCategoryId,
        toggleSort
    };
};
