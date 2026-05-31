export function addCartItem(token: string | null, userId: number, variantId: number, quantity: number) {
    const {
        public: { apiBase },
    } = useRuntimeConfig()
    return $fetch(`${apiBase}/cart/${userId}/items`, {
        method: 'POST',
        body: { variantId, quantity },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
}
