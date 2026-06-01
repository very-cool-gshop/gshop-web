<template>
    <UContainer class="py-12 lg:py-16">
        <h1 class="text-4xl lg:text-5xl text-gray-900 font-extrabold mb-6 lg:mb-8">Welcome to GShop</h1>

        <p class="lg:text-lg mb-12 lg:mb-16">
            Browse our curated collection of products. Find the perfect items for you.
        </p>

        <div v-if="categories?.length">
            <div v-for="category in categories" :key="category.id" class="mb-12 lg:mb-16">
                <div class="flex justify-between items-center mb-6 lg:mb-8">
                    <h2 class="text-3xl lg:text-4xl text-gray-900 font-bold">{{ category.name }}</h2>
                    <UButton
                        :to="`/category/${category.id}`"
                        variant="ghost"
                        color="neutral"
                        label="View all"
                        trailing-icon="i-lucide-arrow-right"
                        :ui="{ trailingIcon: 'size-4' }"
                    />
                </div>

                <div
                    v-if="productsByCategory[category.id]?.length"
                    class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4"
                >
                    <NuxtLink
                        v-for="product in productsByCategory[category.id]"
                        :key="product.id"
                        :to="`/product/${product.id}`"
                        class="group"
                    >
                        <div class="rounded-md overflow-hidden mb-3 bg-gray-100 aspect-square">
                            <img
                                v-if="product.image"
                                :src="product.image.url"
                                :alt="product.name"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <UIcon name="i-lucide-image" class="size-12 text-gray-300" />
                            </div>
                        </div>
                        <p class="font-medium truncate">{{ product.name }}</p>
                        <p class="text-gray-600 font-semibold">${{ product.price }}</p>
                    </NuxtLink>
                </div>

                <p v-else class="text-gray-400">No products in this category yet.</p>
            </div>
        </div>

        <div v-else class="text-center py-20 text-gray-400">No categories found.</div>
    </UContainer>
</template>

<script setup lang="ts">
interface ProductImage {
    id: number
    url: string
}

interface Product {
    id: number
    name: string
    price: string
    image: ProductImage | null
    categoryId: number
}

interface Category {
    id: number
    name: string
}

useSeoMeta({ title: 'GShop' })

const apiFetch = useApiFetch()

const [{ data: categories }, { data: productsData }] = await Promise.all([
    useAsyncData<Category[]>('categories', () => apiFetch('/categories')),
    useAsyncData<{ data: Product[] }>('home-products', () => apiFetch('/products', { params: { limit: 100 } })),
])

const productsByCategory = computed(() => {
    const map: Record<number, Product[]> = {}
    for (const product of productsData.value?.data ?? []) {
        const list = map[product.categoryId] ?? (map[product.categoryId] = [])
        if (list.length < 4) list.push(product)
    }
    return map
})
</script>
