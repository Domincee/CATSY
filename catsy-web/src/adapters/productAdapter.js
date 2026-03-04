export const productAdapter = {
    adaptProductToMenuItem: (apiProduct) => ({
        id: apiProduct.product_id,
        name: apiProduct.product_name,
        price: `₱${apiProduct.product_price.toFixed(2)}`,
        // Mapping available status if needed, though mostly visual in menu
        isAvailable: apiProduct.product_is_available
    })
};
