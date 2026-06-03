interface ApiProduct {
    id: number
    name: string
    image: { url: string } | null
}

interface ApiVariant {
    id: number
    name: string
    price: string
    image: { url: string } | null
    Product: ApiProduct
}

export interface ApiCartItem {
    id: number
    cartId: number
    variantId: number
    quantity: number
    ProductVariant: ApiVariant
}

interface ApiCart {
    id: number
    userId: number
    CartItems: ApiCartItem[]
}

export function useApiCart() {
    const count = useState('api-cart-count', () => 0)
    const items = useState<ApiCartItem[]>('api-cart-items', () => [])
    const apiFetch = useApiFetch()
    const { user, isLoggedIn } = useAuth()

    const total = computed(() =>
        items.value.reduce((sum, item) => sum + Number(item.ProductVariant.price) * item.quantity, 0),
    )

    async function fetchCart() {
        if (!isLoggedIn.value || !user.value) return
        try {
            const cart = await apiFetch<ApiCart>(`/cart`)
            items.value = cart.CartItems ?? []
            count.value = items.value.length
        } catch {
            count.value = 0
            items.value = []
        }
    }

    async function updateItem(itemId: number, quantity: number) {
        if (!user.value) return
        const item = items.value.find((i) => i.id === itemId)
        if (item) item.quantity = quantity
        try {
            await apiFetch(`/cart/items/${itemId}`, {
                method: 'PATCH',
                body: { quantity },
            })
        } catch {
            await fetchCart()
        }
    }

    async function removeItem(itemId: number) {
        if (!user.value) return
        items.value = items.value.filter((i) => i.id !== itemId)
        count.value = items.value.length
        try {
            await apiFetch(`/cart/items/${itemId}`, {
                method: 'DELETE',
            })
        } catch {
            await fetchCart()
        }
    }

    function increment() {
        count.value++
    }

    return { count, items, total, fetchCart, updateItem, removeItem, increment }
}
