export function addCartItem(token: string | null, variantId: number, quantity: number) {
    const {
        public: { apiBase },
    } = useRuntimeConfig()
    return $fetch(`${apiBase}/cart/items`, {
        method: 'POST',
        body: { variantId, quantity },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
}
