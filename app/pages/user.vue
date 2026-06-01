<template>
    <UContainer class="py-12 lg:py-16 max-w-2xl">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-extrabold text-gray-900">我的帳戶</h1>
            <UButton variant="ghost" color="neutral" label="登出" class="cursor-pointer" @click="logout" />
        </div>

        <div class="mb-10 p-6 border border-default rounded-lg">
            <h2 class="text-lg font-bold mb-4">個人資料</h2>
            <div class="flex items-center gap-4 mb-6">
                <img
                    v-if="user?.avatar"
                    :src="user.avatar"
                    :alt="user.name"
                    class="size-16 rounded-full object-cover"
                />
                <div v-else class="size-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <UIcon name="i-lucide-user" class="size-8 text-gray-400" />
                </div>
                <span class="text-lg font-semibold">{{ user?.name }}</span>
            </div>
            <div class="flex flex-col gap-2 text-sm">
                <div class="flex gap-2">
                    <span class="text-gray-500 w-20">姓名</span>
                    <span class="font-medium">{{ user?.name }}</span>
                </div>
                <div class="flex gap-2">
                    <span class="text-gray-500 w-20">電子郵件</span>
                    <span class="font-medium">{{ user?.email }}</span>
                </div>
                <div class="flex gap-2">
                    <span class="text-gray-500 w-20">電話</span>
                    <span class="font-medium">{{ user?.phone ?? '—' }}</span>
                </div>
            </div>
        </div>

        <div class="mb-10 p-6 border border-default rounded-lg">
            <h2 class="text-lg font-bold mb-4">我的訂單</h2>

            <div v-if="ordersLoading" class="text-center py-8">
                <UIcon name="i-lucide-loader-circle" class="size-6 text-gray-400 animate-spin mx-auto" />
            </div>

            <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-400 text-sm">
                尚無訂單
            </div>

            <div v-else class="flex flex-col gap-4">
                <div v-for="order in orders" :key="order.id" class="border border-default rounded-lg p-4">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <span class="text-sm font-semibold">#{{ order.id }}</span>
                            <span class="text-xs text-gray-400 ml-2">{{ new Date(order.createdAt).toLocaleDateString() }}</span>
                        </div>
                        <UBadge :color="statusColor(order.status)" variant="subtle" :label="order.status" />
                    </div>

                    <div class="flex flex-col gap-1 mb-3">
                        <div v-for="item in order.OrderItems" :key="item.id" class="flex justify-between text-sm">
                            <span class="text-gray-600">{{ item.productName }}<span v-if="item.variantName" class="text-gray-400"> · {{ item.variantName }}</span> × {{ item.quantity }}</span>
                            <span class="font-medium">${{ Number(item.subtotal).toFixed(2) }}</span>
                        </div>
                    </div>

                    <div class="flex justify-end border-t border-default pt-2 text-sm font-bold">
                        總計：${{ Number(order.totalAmount).toFixed(2) }}
                    </div>
                </div>
            </div>
        </div>

        <div class="p-6 border border-default rounded-lg">
            <h2 class="text-lg font-bold mb-4">修改密碼</h2>
            <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="handleChangePassword">
                <UFormField name="currentPassword" label="目前密碼">
                    <UInput v-model="state.currentPassword" type="password" class="w-full" />
                </UFormField>
                <UFormField name="newPassword" label="新密碼">
                    <UInput v-model="state.newPassword" type="password" class="w-full" />
                </UFormField>
                <UFormField name="confirmPassword" label="確認新密碼">
                    <UInput v-model="state.confirmPassword" type="password" class="w-full" />
                </UFormField>
                <UButton type="submit" label="更新密碼" class="cursor-pointer" :loading="loading" />
            </UForm>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ middleware: 'auth' })

const { user, logout } = useAuth()
const apiFetch = useApiFetch()
const toast = useToast()
const loading = ref(false)

interface OrderItem {
    id: number
    productName: string
    variantName: string
    quantity: number
    subtotal: string
}

interface Order {
    id: number
    status: string
    totalAmount: string
    createdAt: string
    OrderItems: OrderItem[]
}

const orders = ref<Order[]>([])
const ordersLoading = ref(true)

const statusColor = (status: string) => {
    const map: Record<string, string> = {
        pending: 'yellow',
        paid: 'blue',
        shipped: 'purple',
        delivered: 'green',
        cancelled: 'red',
    }
    return map[status] ?? 'neutral'
}

const { data: ordersData } = await useAsyncData('orders', () =>
    apiFetch<{ data: Order[] }>('/orders'),
)
orders.value = ordersData.value?.data ?? []
ordersLoading.value = false

const schema = z
    .object({
        currentPassword: z.string().min(1, '必填'),
        newPassword: z.string().min(6, '最少 6 個字元'),
        confirmPassword: z.string().min(1, '必填'),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: '密碼不一致',
        path: ['confirmPassword'],
    })

type Schema = z.output<typeof schema>

const state = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })

const handleChangePassword = async (event: FormSubmitEvent<Schema>) => {
    loading.value = true
    try {
        await apiFetch('/auth/change-password', {
            method: 'PATCH',
            body: {
                currentPassword: event.data.currentPassword,
                newPassword: event.data.newPassword,
            },
        })
        toast.add({ title: '密碼已更新', color: 'success' })
        state.currentPassword = ''
        state.newPassword = ''
        state.confirmPassword = ''
    } catch (error: any) {
        toast.add({ title: error?.data?.message ?? '密碼更新失敗', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
