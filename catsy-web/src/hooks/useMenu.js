import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { logger } from '../utils/logger';
import { useSSE } from './useSSE';
import mockMenuData from '../data/menu.json';

// Normalise mock JSON into the same shape the component expects
function buildMockCategories() {
    return mockMenuData.map((cat, idx) => ({
        category_id: `mock-${idx}`,
        name: cat.category,
        iconName: cat.iconName,
        items: cat.items.map(item => ({
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            product_is_eligible: false,
            product_is_available: true,
            category_id: `mock-${idx}`
        }))
    }));
}

export function useMenu() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMockData, setIsMockData] = useState(false);

    const loadMenu = useCallback(async () => {
        try {
            const [apiCategories, apiProducts] = await Promise.all([
                productService.getAllCategories(),
                productService.getAllProducts()
            ]);

            if (!apiCategories || !apiProducts) throw new Error('Empty API response');

            // Only show available products
            const availableProducts = apiProducts.filter(p => p.product_is_available);

            // Group products by category
            const builtMenu = apiCategories.map(cat => ({
                category_id: cat.category_id,
                name: cat.name,
                items: availableProducts.filter(p => p.category_id === cat.category_id)
            })).filter(cat => cat.items.length > 0);

            setCategories(builtMenu);
            setIsMockData(false);
            if (builtMenu.length > 0 && !selectedCategory) {
                setSelectedCategory(builtMenu[0]);
            }
        } catch (error) {
            logger.warn("API unavailable – falling back to mock menu data:", error);
            const mock = buildMockCategories();
            setCategories(mock);
            setIsMockData(true);
            setSelectedCategory(prev => prev ?? mock[0]);
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
        isLoading,
        isMockData
    };
}
