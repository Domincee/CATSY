import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { logger } from '../utils/logger';
import { useSSE } from './useSSE';

export function useMenu() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadMenu = useCallback(async () => {
        try {
            const [apiCategories, apiProducts] = await Promise.all([
                productService.getAllCategories(),
                productService.getAllProducts()
            ]);

            if (!apiCategories || !apiProducts) return;

            // Only show available products
            const availableProducts = apiProducts.filter(p => p.product_is_available);

            // Group products by category
            const builtMenu = apiCategories.map(cat => ({
                category_id: cat.category_id,
                name: cat.name,
                items: availableProducts.filter(p => p.category_id === cat.category_id)
            })).filter(cat => cat.items.length > 0);

            setCategories(builtMenu);
            if (builtMenu.length > 0 && !selectedCategory) {
                setSelectedCategory(builtMenu[0]);
            }
        } catch (error) {
            logger.error("Failed to load menu:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMenu();
    }, [loadMenu]);

    // Real-time: refresh when admin updates menu
    useSSE({ 'menu.updated': loadMenu });

    return {
        categories,
        selectedCategory,
        setSelectedCategory,
        isOpen,
        setIsOpen,
        isLoading
    };
}
