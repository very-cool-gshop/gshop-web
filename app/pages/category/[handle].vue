<template>
    <UContainer class="py-6 lg:py-8">
        <UBreadcrumb
            :items="[{ label: '所有分類', to: '/' }, { label: categoryName }]"
            class="mb-6 lg:mb-8"
        />

        <h1 class="text-4xl lg:text-5xl text-gray-900 font-extrabold mb-6 lg:mb-8">{{ categoryName }}</h1>
        <p v-if="categoryDescription" class="lg:text-lg max-w-md mb-8 lg:mb-10">{{ categoryDescription }}</p>

        <div class="w-full lg:grid lg:grid-cols-12">
            <!-- Filter Sidebar -->
            <div class="lg:col-span-4 xl:col-span-3 lg:mt-14 lg:me-16">
                <div class="lg:sticky lg:top-24">
                    <div class="flex justify-between items-center mb-4">
                        <p class="leading-8 text-xl font-bold">篩選</p>
                        <UButton
                            v-if="hasActiveFilters"
                            variant="ghost"
                            color="primary"
                            label="清除篩選"
                            @click="clearFilters"
                        />
                    </div>

                    <UAccordion
                        :items="accordionItems"
                        type="multiple"
                    >
                        <template #availability>
                            <UCheckboxGroup
                                v-model="availability"
                                :items="availabilityOptions"
                                class="pb-2"
                                @update:model-value="applyFilters"
                            />
                        </template>

                        <template #price>
                            <div class="flex flex-row gap-4 pb-2">
                                <UFormField name="minPrice" label="from">
                                    <UInputNumber v-model="minPrice" class="w-24" :min="0" @change="applyFilters" />
                                </UFormField>
                                <UFormField name="maxPrice" label="to">
                                    <UInputNumber v-model="maxPrice" class="w-24" :min="0" @change="applyFilters" />
                                </UFormField>
                            </div>
                        </template>

                    </UAccordion>
                </div>
            </div>

            <!-- Product Grid -->
            <div class="my-12 lg:my-14 lg:col-span-8 xl:col-span-9">
                <div v-if="status === 'pending'" class="flex justify-center pt-8">載入中...</div>

                <div
                    v-else-if="!products?.data?.length"
                    class="flex flex-col justify-center items-center col-span-full text-center"
                >
                    <div class="flex items-center pb-2 gap-2">
                        <UIcon name="i-lucide-triangle-alert" class="text-dimmed size-6" />
                        <p class="text-xl text-dimmed">找不到商品</p>
                    </div>
                    <UButton
                        v-if="hasActiveFilters"
                        variant="subtle"
                        color="primary"
                        class="mt-4"
                        label="清除篩選"
                        @click="clearFilters"
                    />
                </div>

                <div v-else class="grid w-full grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3">
                    <UCard
                        v-for="product in products.data"
                        :key="product.id"
                        variant="soft"
                        :ui="{ body: 'h-full !p-0', root: 'rounded-none !bg-transparent' }"
                        class="flex flex-col max-w-full h-full pb-14 border-b border-b-default"
                    >
                        <NuxtLink :to="`/product/${product.id}`">
                            <img
                                v-if="product.image"
                                :src="product.image.url"
                                :alt="product.name"
                                class="w-full aspect-square object-cover rounded-md mb-4"
                            />
                            <div
                                v-else
                                class="w-full aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center"
                            >
                                <UIcon name="i-lucide-image" class="size-12 text-gray-300" />
                            </div>
                        </NuxtLink>

                        <div class="flex justify-end flex-wrap items-center relative">
                            <NuxtLink :to="`/product/${product.id}`" class="grow">
                                <p class="font-headings text-xl me-12">{{ product.name }}</p>
                                <p class="text-gray-900 font-semibold">${{ product.price }}</p>
                            </NuxtLink>

                            <UButton
                                color="neutral"
                                variant="ghost"
                                trailing-icon="i-lucide-shopping-bag"
                                label="加入"
                                aria-label="加入購物車"
                                :ui="{
                                    trailingIcon: 'size-5',
                                    label: [
                                        'ms-auto',
                                        'max-w-0',
                                        'invisible',
                                        'group-focus:visible',
                                        'group-focus:max-w-full',
                                        'group-hover:visible',
                                        'group-hover:max-w-full',
                                        'transition-all',
                                        'duration-300',
                                        'truncate-0',
                                        'ps-1.5',
                                        'pe-1',
                                    ],
                                    base: 'absolute bottom-0 group rounded-full p-2.5',
                                }"
                                @click="handleAddToCart(product.id)"
                            />
                        </div>
                    </UCard>
                </div>
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

interface Product {
    id: number
    name: string
    description: string
    price: string
    status: string
    categoryId: number
    image: ProductImage | null
}

interface ProductsResponse {
    total: number
    page: number
    totalPages: number
    data: Product[]
}

import { addCartItem } from '~/api/cart'

const router = useRouter()
const route = useRoute()
const apiFetch = useApiFetch()
const { user, isLoggedIn } = useAuth()
const token = useCookie('token')
const toast = useToast()
const { fetchCart } = useApiCart()

const handleAddToCart = async (productId: number) => {
    if (!isLoggedIn.value) {
        await navigateTo('/login')
        return
    }
    try {
        const p = await apiFetch<{ ProductVariants: { id: number }[] }>(`/products/${productId}`)
        const variantId = p.ProductVariants?.[0]?.id
        if (!variantId) {
            toast.add({ title: '此商品無可用規格', color: 'error' })
            return
        }
        await addCartItem(token.value ?? null, user.value!.id, variantId, 1)
        fetchCart()
        toast.add({ title: '已加入購物車', color: 'success' })
    } catch (error: any) {
        if (error?.response?.status === 401) {
            await navigateTo('/login')
            return
        }
        toast.add({ title: error?.data?.message ?? error?.message ?? '加入購物車失敗', color: 'error' })
    }
}

const availabilityOptions = [
    { label: '有庫存', value: 'instock' },
    { label: '已售完', value: 'outofstock' },
]

const accordionItems = [
    { label: '庫存狀態', slot: 'availability', value: 'availability' },
    { label: '價格', slot: 'price', value: 'price' },
]

const availability = ref<string[]>(route.query.availability ? (route.query.availability as string).split(',') : [])
const minPrice = ref(route.query.minPrice ? Number(route.query.minPrice) : undefined)
const maxPrice = ref(route.query.maxPrice ? Number(route.query.maxPrice) : undefined)
const hasActiveFilters = computed(() => minPrice.value !== undefined || maxPrice.value !== undefined)

const applyFilters = () => {
    router.push({
        query: {
            minPrice: minPrice.value ?? undefined,
            maxPrice: maxPrice.value ?? undefined,
        },
    })
}

const clearFilters = () => {
    minPrice.value = undefined
    maxPrice.value = undefined
    router.push({ query: {} })
}

const categoryId = computed(() => Number(route.params.handle))

const { data: categoryList } = await useAsyncData<{ id: number; name: string; description: string | null }[]>('categories-nav', () =>
    apiFetch('/categories'),
)
const categoryName = computed(
    () => categoryList.value?.find((c) => c.id === categoryId.value)?.name ?? '商品列表',
)
const categoryDescription = computed(
    () => categoryList.value?.find((c) => c.id === categoryId.value)?.description ?? null,
)

const queryParams = computed(() => ({
    categoryId: categoryId.value,
    minPrice: minPrice.value ?? undefined,
    maxPrice: maxPrice.value ?? undefined,
}))

const { data: products, status } = await useAsyncData<ProductsResponse>(
    () => `category-${route.params.handle}`,
    () => apiFetch('/products', { params: queryParams.value }),
    { watch: [queryParams] },
)
</script>
