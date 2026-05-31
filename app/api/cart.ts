export function addCartItem(userId: number, variantId: number, quantity: number) {
    const {
        public: { apiBase },
    } = useRuntimeConfig()
    const token = useCookie('token')
    return $fetch(`${apiBase}/cart/${userId}/items`, {
        method: 'POST',
        body: { variantId, quantity },
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    })
}
