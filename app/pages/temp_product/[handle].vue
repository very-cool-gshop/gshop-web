<template>
    <UContainer class="py-6 pb-12 lg:py-8 lg:pb-16">
        <UBreadcrumb
            :items="[{ label: 'Categories', to: '/category/clothing' }, { label: product?.name }]"
            class="mb-6 lg:mb-8"
        />

        <div v-if="product" class="mb-12 lg:grid lg:grid-cols-12 lg:mb-16">
            <!-- Gallery -->
            <div class="lg:col-span-6 mb-8 lg:mb-0">
                <template v-if="allImages.length > 1">
                    <UCarousel
                        v-slot="{ item, index }"
                        :items="allImages"
                        :ui="{ prev: 'left-3!', next: 'right-3!' }"
                        class="mb-6 lg:mb-8"
                        arrows
                        loop
                    >
                        <div class="max-w-full rounded-md overflow-hidden">
                            <img
                                :src="item.url"
                                :alt="product.name"
                                :loading="index === 0 ? 'eager' : 'lazy'"
                                class="aspect-square max-w-full max-h-full select-none object-contain"
                            />
                        </div>
                    </UCarousel>
                </template>

                <template v-else-if="allImages.length === 1">
                    <div class="max-w-full rounded-md overflow-hidden mb-6 lg:mb-8">
                        <img
                            :src="allImages[0]?.url"
                            :alt="product.name"
                            loading="eager"
                            class="aspect-square max-w-full max-h-full select-none object-contain"
                        />
                    </div>
                </template>

                <div v-else class="max-w-full rounded-md overflow-hidden mb-6 lg:mb-8 bg-gray-100 flex items-center justify-center aspect-square">
                    <UIcon name="i-lucide-image" class="size-24 text-gray-300" />
                </div>

                <!-- Thumbnails -->
                <div v-if="allImages.length > 1" class="hidden lg:grid grid-cols-12 gap-8 mb-6 lg:mb-8">
                    <div
                        v-for="(img, i) in allImages"
                        :key="img.id"
                        class="col-span-6 rounded-md overflow-hidden"
                    >
                        <img
                            :src="img.url"
                            :alt="`${product.name}${i !== 0 ? ` (${i})` : ''}`"
                            class="aspect-square max-w-full object-contain"
                        />
                    </div>
                </div>
            </div>

            <!-- Product Info -->
            <div class="lg:col-span-4 lg:col-start-8">
                <div class="lg:sticky lg:top-[calc(var(--ui-header-height)+3rem)]">
                    <!-- Configurator -->
                    <div class="mb-12 lg:mb-16">
                        <div class="flex-col lg:flex pb-6 lg:pb-8">
                            <h1 class="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                                {{ product.name }}
                            </h1>
                            <span class="font-bold lg:text-lg">
                                ${{ selectedVariant ? selectedVariant.price : product.price }}
                            </span>
                        </div>

                        <USeparator class="mb-6 lg:mb-8" />

                        <div v-if="product.ProductVariants?.length" class="mb-6 lg:mb-8">
                            <p class="text-sm font-medium text-gray-700 mb-2">Variants</p>
                            <URadioGroup
                                v-model="selectedVariantId"
                                variant="card"
                                indicator="hidden"
                                :ui="{ fieldset: 'flex-row flex-wrap gap-2' }"
                                :items="product.ProductVariants.map(v => ({ label: v.name, value: String(v.id) }))"
                            />
                            <p v-if="selectedVariant && selectedVariant.stock > 0" class="text-sm text-green-600 mt-2">
                                In stock ({{ selectedVariant.stock }} available)
                            </p>
                            <p v-else-if="selectedVariant" class="text-sm text-red-500 mt-2">Out of stock</p>
                        </div>

                        <div class="flex justify-between items-center">
                            <UFormField name="quantity" label="Quantity" :ui="{ label: 'hidden' }">
                                <UInputNumber v-model="quantity" :min="1" :max="10" class="w-24 lg:w-28" size="xl" />
                            </UFormField>

                            <UButton
                                size="xl"
                                variant="subtle"
                                trailing-icon="i-lucide-shopping-bag"
                                :ui="{ trailingIcon: 'size-5' }"
                                label="Add"
                            />
                        </div>
                    </div>

                    <p class="mb-6 lg:text-lg lg:mb-8">{{ product.description }}</p>
                </div>
            </div>
        </div>

        <!-- You may also like -->
        <div v-if="relatedItems.length">
            <h2 class="text-3xl text-gray-900 font-bold mb-6 lg:mb-8 lg:text-4xl">You may also like</h2>
            <div class="mb-12 sm:px-12 lg:mb-16">
                <UCarousel
                    v-slot="{ item }"
                    :items="relatedItems"
                    :ui="{ item: 'md:basis-1/2 lg:basis-1/3' }"
                    class="w-full mb-6"
                    arrows
                    loop
                >
                    <UCard
                        class="flex flex-col max-w-full h-full mx-4"
                        variant="soft"
                        :ui="{ body: 'h-full !p-0', root: 'rounded-none !bg-transparent' }"
                    >
                        <NuxtLink :to="`/${item.id}`">
                            <div class="group relative rounded-md overflow-hidden mb-4">
                                <img
                                    v-if="item.image"
                                    :src="item.image.url"
                                    :alt="item.name"
                                    class="aspect-square max-w-full object-contain"
                                />
                                <div
                                    v-else
                                    class="aspect-square bg-gray-100 flex items-center justify-center"
                                >
                                    <UIcon name="i-lucide-image" class="size-12 text-gray-300" />
                                </div>
                            </div>
                        </NuxtLink>
                        <div class="flex justify-end flex-wrap items-center relative">
                            <NuxtLink :to="`/${item.id}`" class="grow">
                                <p class="font-headings text-xl me-12">{{ item.name }}</p>
                                <span class="font-bold">${{ item.price }}</span>
                            </NuxtLink>
                            <UButton
                                color="neutral"
                                variant="ghost"
                                trailing-icon="i-lucide-shopping-bag"
                                label="Add"
                                aria-label="Add to cart"
                                :ui="{
                                    trailingIcon: 'size-5',
                                    label: ['ms-auto', 'max-w-0', 'invisible', 'group-focus:visible', 'group-focus:max-w-full', 'group-hover:visible', 'group-hover:max-w-full', 'transition-all', 'duration-300', 'truncate-0', 'ps-1.5', 'pe-1'],
                                    base: 'absolute bottom-0 group rounded-full p-2.5',
                                }"
                            />
                        </div>
                    </UCard>
                </UCarousel>
            </div>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
interface ProductImage {
    id: number
    url: string
    filename: string
}

interface ProductVariant {
    id: number
    productId: number
    name: string
    price: string
    stock: number
    image: ProductImage | null
}

interface Product {
    id: number
    name: string
    description: string
    price: string
    status: string
    categoryId: number
    imageId: number | null
    image: ProductImage | null
    ProductImages: ProductImage[]
    ProductVariants: ProductVariant[]
}

interface ProductsResponse {
    total: number
    page: number
    totalPages: number
    data: Product[]
}

const route = useRoute()
const apiFetch = useApiFetch()

const productId = computed(() => route.params.handle as string)

const { data: product, error } = await useAsyncData<Product>(
    `product-${productId.value}`,
    () => apiFetch(`/products/${productId.value}`)
)

if (!product.value || error.value) {
    throw createError({
        status: 404,
        statusText: `Page not found: ${route.fullPath}`,
        message: 'Product not found',
        fatal: true,
    })
}

const { data: relatedProducts } = await useAsyncData<ProductsResponse>(
    `related-${productId.value}`,
    () => apiFetch('/products', { params: { categoryId: product.value?.categoryId, limit: 7 } })
)

const allImages = computed(() => {
    const imgs: ProductImage[] = []
    if (product.value?.image) imgs.push(product.value.image)
    product.value?.ProductImages?.forEach((img) => {
        if (!imgs.find((i) => i.id === img.id)) imgs.push(img)
    })
    return imgs
})

const relatedItems = computed(() =>
    relatedProducts.value?.data?.filter((p) => p.id !== product.value?.id) ?? []
)

const quantity = ref(1)
const selectedVariant = ref<ProductVariant | null>(product.value?.ProductVariants?.[0] ?? null)

const selectedVariantId = computed({
    get: () => String(selectedVariant.value?.id ?? ''),
    set: (id) => {
        selectedVariant.value = product.value?.ProductVariants?.find(v => String(v.id) === id) ?? null
    },
})
</script>
