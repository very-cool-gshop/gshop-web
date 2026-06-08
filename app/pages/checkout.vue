<template>
    <UContainer class="py-12 lg:py-16 max-w-5xl">
        <h1 class="text-3xl lg:text-4xl text-gray-900 font-extrabold mb-8">結帳</h1>

        <div v-if="items.length === 0" class="text-center py-20">
            <UIcon name="i-lucide-shopping-cart" class="size-16 text-gray-300 mx-auto mb-4" />
            <p class="text-lg text-gray-500 mb-6">購物車是空的</p>
            <UButton label="繼續購物" to="/" />
        </div>

        <div v-else-if="orderPlaced" class="text-center py-20">
            <UIcon name="i-lucide-circle-check" class="size-16 text-green-500 mx-auto mb-4" />
            <h2 class="text-2xl font-bold mb-2">訂單已成立！</h2>
            <p class="text-gray-500 mb-6">感謝您的購買，我們將盡快為您確認訂單。</p>
            <UButton label="返回首頁" to="/" />
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <UForm :schema="schema" :state="state" class="lg:col-span-2 flex flex-col gap-6" @submit="handlePlaceOrder">
                <div class="p-6 border border-default rounded-lg">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-bold">收件資訊</h2>
                        <UButton
                            variant="subtle"
                            size="sm"
                            icon="i-lucide-user"
                            label="帶入會員資料"
                            @click="fillUserInfo"
                        />
                    </div>
                    <div class="flex flex-col gap-4">
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

                        <UFormField name="note" label="備註">
                            <UTextarea v-model="state.note" class="w-full" placeholder="如有特殊需求請填寫" />
                        </UFormField>
                    </div>
                </div>

                <div class="p-6 border border-default rounded-lg">
                    <h2 class="text-lg font-bold mb-4">付款方式</h2>
                    <div class="flex flex-col gap-4">
                        <UFormField name="paymentMethod" label="選擇付款方式" required>
                            <div class="flex flex-col gap-3">
                                <label
                                    v-for="option in paymentOptions"
                                    :key="option.value"
                                    class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
                                    :class="state.paymentMethod === option.value ? 'border-primary bg-primary/5' : 'border-default hover:border-gray-400'"
                                >
                                    <input
                                        v-model="state.paymentMethod"
                                        type="radio"
                                        :value="option.value"
                                        class="accent-primary"
                                    />
                                    <UIcon :name="option.icon" class="size-5 text-gray-600 shrink-0" />
                                    <div>
                                        <p class="font-medium text-sm">{{ option.label }}</p>
                                        <p class="text-xs text-gray-500">{{ option.description }}</p>
                                    </div>
                                </label>
                            </div>
                        </UFormField>

                        <div class="flex justify-end pt-2">
                            <UButton
                                type="submit"
                                label="送出訂單"
                                size="xl"
                                trailing-icon="i-lucide-arrow-right"
                                :loading="loading"
                                :ui="{ trailingIcon: 'size-4' }"
                            />
                        </div>
                    </div>
                </div>
            </UForm>

            <div class="flex flex-col gap-4">
                <div class="p-6 border border-default rounded-lg">
                    <h2 class="text-lg font-bold mb-4">訂單摘要</h2>

                    <div class="flex flex-col gap-3 mb-4">
                        <div v-for="item in items" :key="item.id" class="flex gap-3 items-center">
                            <NuxtImg
                                v-if="item.ProductVariant.image?.url || item.ProductVariant.Product.image?.url"
                                :src="(item.ProductVariant.image?.url || item.ProductVariant.Product.image?.url)!"
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
                                <p class="text-xs text-gray-400">數量：{{ item.quantity }}</p>
                            </div>

                            <p class="text-sm font-semibold shrink-0">
                                {{ (Number(item.ProductVariant.price) * item.quantity).toFixed(2) }}
                            </p>
                        </div>
                    </div>

                    <USeparator class="my-4" />

                    <div class="flex flex-col gap-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-500">小計</span>
                            <span class="font-medium">{{ total.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500">運費</span>
                            <span class="font-medium text-green-600">免費</span>
                        </div>
                        <USeparator class="my-1" />
                        <div class="flex justify-between text-base">
                            <span class="font-bold">總計</span>
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

useSeoMeta({ title: '結帳' })

const { items, total, fetchCart } = useApiCart()
const { user } = useAuth()
const toast = useToast()

const loading = ref(false)
const orderPlaced = ref(false)

const paymentOptions = [
    { value: 'credit_card', label: '信用卡', description: '支援 Visa、Mastercard、JCB', icon: 'i-lucide-credit-card' },
    { value: 'transfer', label: '銀行轉帳', description: '下單後 3 日內完成匯款', icon: 'i-lucide-landmark' },
    { value: 'cod', label: '貨到付款', description: '收到商品時以現金付款', icon: 'i-lucide-banknote' },
]

const schema = z.object({
    recipientName: z.string().min(1, 'Required'),
    recipientPhone: z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    note: z.string().optional(),
    paymentMethod: z.string().min(1, '請選擇付款方式'),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
    recipientName: '',
    recipientPhone: '',
    address: '',
    note: '',
    paymentMethod: '',
})

const fillUserInfo = () => {
    if (!user.value) return
    state.recipientName = user.value.name
    state.recipientPhone = user.value.phone ?? ''
    state.address = user.value.address ?? ''
}

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
                note: state.note || undefined,
                paymentMethod: state.paymentMethod,
            },
        })

        await fetchCart()
        orderPlaced.value = true
    } catch {
        toast.add({ title: '訂單送出失敗，請再試一次', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
