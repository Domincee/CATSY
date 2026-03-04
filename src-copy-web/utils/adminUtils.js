/**
 * Filtering and Sorting utilities for the Admin Dashboard
 */

/**
 * Filters products based on selected category.
 * @param {Array} products 
 * @param {string|number} categoryId - 'all', 'uncategorized', or specific ID
 * @param {Array} categories - Reference list of categories
 */
export const filterProducts = (products, categoryId, categories) => {
    if (categoryId === 'all') return products;

    if (categoryId === 'uncategorized') {
        return products.filter(p => !p.category_id || !categories.find(c => c.category_id === p.category_id));
    }

    return products.filter(p => p.category_id === categoryId);
};

/**
 * Sorts products based on property and order.
 * @param {Array} products 
 * @param {string} sortBy - 'name', 'price'
 * @param {string} sortOrder - 'asc', 'desc'
 */
export const sortProducts = (products, sortBy, sortOrder) => {
    return [...products].sort((a, b) => {
        if (sortBy === 'name') {
            const nameA = a.product_name || '';
            const nameB = b.product_name || '';
            return sortOrder === 'asc'
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        }

        if (sortBy === 'price') {
            const priceA = Number(a.product_price) || 0;
            const priceB = Number(b.product_price) || 0;
            return sortOrder === 'asc'
                ? priceA - priceB
                : priceB - priceA;
        }

        return 0;
    });
};

/**
 * Process products: Apply filter then sort.
 */
export const processAdminProducts = (products, filterId, categories, sortBy, sortOrder) => {
    const filtered = filterProducts(products, filterId, categories);
    return sortProducts(filtered, sortBy, sortOrder);
};
