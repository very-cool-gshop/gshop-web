<template>
    <UContainer class="py-12 lg:py-16 max-w-5xl">
        <h1 class="text-3xl lg:text-4xl text-gray-900 font-extrabold mb-8">Checkout</h1>

        <div v-if="items.length === 0" class="text-center py-20">
            <UIcon name="i-lucide-shopping-cart" class="size-16 text-gray-300 mx-auto mb-4" />
            <p class="text-lg text-gray-500 mb-6">Your cart is empty.</p>
            <UButton label="Continue Shopping" to="/" />
        </div>

        <div v-else-if="orderPlaced" class="text-center py-20">
            <UIcon name="i-lucide-circle-check" class="size-16 text-green-500 mx-auto mb-4" />
            <h2 class="text-2xl font-bold mb-2">Order Placed!</h2>
            <p class="text-gray-500 mb-6">Thank you for your purchase. We'll send you a confirmation soon.</p>
            <UButton label="Back to Home" to="/" />
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 flex flex-col gap-6">
                <div class="p-6 border border-default rounded-lg">
                    <h2 class="text-lg font-bold mb-4">Shipping Address</h2>
                    <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="handlePlaceOrder">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <UFormField name="recipientName" label="收件人姓名" required>
                                <UInput v-model="state.recipientName" class="w-full" />
                            </UFormField>
                            <UFormField name="recipientPhone" label="收件人電話" required>
                                <UInput v-model="state.recipientPhone" type="tel" class="w-full" />
                            </UFormField>
                        </div>

                        <UFormField name="address" label="收件地址" required>
                            <UInput v-model="state.address" class="w-full" />
                        </UFormField>

                        <div class="flex justify-end pt-2">
                            <UButton
                                type="submit"
                                label="Place Order"
                                size="xl"
                                trailing-icon="i-lucide-arrow-right"
                                :loading="loading"
                                :ui="{ trailingIcon: 'size-4' }"
                            />
                        </div>
                    </UForm>
                </div>
            </div>

            <div class="flex flex-col gap-4">
                <div class="p-6 border border-default rounded-lg">
                    <h2 class="text-lg font-bold mb-4">Order Summary</h2>

                    <div class="flex flex-col gap-3 mb-4">
                        <div v-for="item in items" :key="item.id" class="flex gap-3 items-center">
                            <NuxtImg
                                v-if="item.ProductVariant.Product.image?.url"
                                :src="item.ProductVariant.Product.image.url"
                                :alt="item.ProductVariant.Product.name"
                                width="56"
                                height="56"
                                class="size-14 object-cover rounded shrink-0"
                            />
                            <div v-else class="size-14 bg-gray-100 rounded shrink-0" />

                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium truncate">{{ item.ProductVariant.Product.name }}</p>
                                <p v-if="item.ProductVariant.name" class="text-xs text-gray-500 truncate">
                                    {{ item.ProductVariant.name }}
                                </p>
                                <p class="text-xs text-gray-400">Qty: {{ item.quantity }}</p>
                            </div>

                            <p class="text-sm font-semibold shrink-0">
                                {{ (Number(item.ProductVariant.price) * item.quantity).toFixed(2) }}
                            </p>
                        </div>
                    </div>

                    <USeparator class="my-4" />

                    <div class="flex flex-col gap-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-500">Subtotal</span>
                            <span class="font-medium">{{ total.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">Shipping</span>
                            <span class="font-medium text-green-600">Free</span>
                        </div>
                        <USeparator class="my-1" />
                        <div class="flex justify-between text-base">
                            <span class="font-bold">Total</span>
                            <span class="font-bold">{{ total.toFixed(2) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ middleware: 'auth' })

useSeoMeta({ title: 'Checkout' })

const { items, total, fetchCart } = useApiCart()
const toast = useToast()

const loading = ref(false)
const orderPlaced = ref(false)

const schema = z.object({
    recipientName: z.string().min(1, 'Required'),
    recipientPhone: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
    recipientName: '',
    recipientPhone: '',
    address: '',
})

const apiFetch = useApiFetch()

const handlePlaceOrder = async (_event: FormSubmitEvent<Schema>) => {
    loading.value = true
    try {
        await apiFetch('/cart/checkout', {
            method: 'POST',
            body: {
                recipientName: state.recipientName,
                recipientPhone: state.recipientPhone,
                address: state.address,
            },
        })

        await fetchCart()
        orderPlaced.value = true
    } catch {
        toast.add({ title: 'Failed to place order. Please try again.', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
