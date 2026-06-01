<template>
    <USlideover
        v-model:open="open"
        title="購物車"
        description="查看已選商品"
        :ui="{ description: 'sr-only', body: 'flex flex-col gap-y-6' }"
    >
        <div class="relative">
            <UButton
                icon="i-lucide-shopping-cart"
                variant="ghost"
                color="neutral"
                label="開啟購物車"
                :ui="{
                    label: 'sr-only',
                    base: 'px-1.5 lg:px-2',
                }"
            />

            <ClientOnly>
                <UBadge
                    v-if="count"
                    class="absolute font-bold rounded-full -top-1.5 -right-2 px-1.5 font-mono lg:text-xs lg:-right-3 lg:-top-2"
                    size="xs"
                >
                    {{ count }}
                </UBadge>
            </ClientOnly>
        </div>

        <template #body>
            <TransitionGroup
                enter-to-class="opacity-100"
                leave-to-class="opacity-0"
                leave-from-class="opacity-100"
                enter-from-class="opacity-0"
            >
                <CartApiLineItem v-for="item in items" :key="item.id" :item="item" class="shrink-0 duration-300" />
            </TransitionGroup>

            <p v-if="items.length === 0" class="my-auto text-center">購物車是空的</p>
        </template>

        <template #footer>
            <div v-if="total > 0" class="flex justify-between items-center w-full">
                <p class="font-medium inline-block">
                    小計：<span class="font-semibold">{{ total.toFixed(2) }}</span>
                </p>

                <UButton
                    to="/checkout"
                    variant="ghost"
                    color="neutral"
                    label="結帳"
                    size="xl"
                    trailing-icon="i-lucide-arrow-right"
                    :ui="{
                        trailingIcon: 'size-4',
                    }"
                    @click="open = false"
                />
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
const open = useState('cart-open', () => false)
const { count, items, total, fetchCart } = useApiCart()
const route = useRoute()

watch(
    () => route.path,
    () => (open.value = false),
)

onMounted(fetchCart)
</script>
