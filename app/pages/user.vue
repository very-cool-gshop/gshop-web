<template>
    <UContainer class="py-12 lg:py-16 max-w-lg">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-extrabold text-gray-900">My Account</h1>
            <UButton variant="ghost" color="neutral" label="Sign out" class="cursor-pointer" @click="logout" />
        </div>

        <div class="mb-10 p-6 border border-default rounded-lg">
            <h2 class="text-lg font-bold mb-4">Profile</h2>
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
                    <span class="text-gray-500 w-20">Name</span>
                    <span class="font-medium">{{ user?.name }}</span>
                </div>
                <div class="flex gap-2">
                    <span class="text-gray-500 w-20">Email</span>
                    <span class="font-medium">{{ user?.email }}</span>
                </div>
                <div class="flex gap-2">
                    <span class="text-gray-500 w-20">Phone</span>
                    <span class="font-medium">{{ user?.phone ?? '—' }}</span>
                </div>
            </div>
        </div>

        <div class="p-6 border border-default rounded-lg">
            <h2 class="text-lg font-bold mb-4">Change Password</h2>
            <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="handleChangePassword">
                <UFormField name="currentPassword" label="Current password">
                    <UInput v-model="state.currentPassword" type="password" class="w-full" />
                </UFormField>
                <UFormField name="newPassword" label="New password">
                    <UInput v-model="state.newPassword" type="password" class="w-full" />
                </UFormField>
                <UFormField name="confirmPassword" label="Confirm new password">
                    <UInput v-model="state.confirmPassword" type="password" class="w-full" />
                </UFormField>
                <UButton type="submit" label="Update password" class="cursor-pointer" :loading="loading" />
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

const schema = z
    .object({
        currentPassword: z.string().min(1, 'Required'),
        newPassword: z.string().min(6, 'Minimum 6 characters'),
        confirmPassword: z.string().min(1, 'Required'),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: 'Passwords do not match',
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
        toast.add({ title: 'Password updated.', color: 'success' })
        state.currentPassword = ''
        state.newPassword = ''
        state.confirmPassword = ''
    } catch (error: any) {
        toast.add({ title: error?.data?.message ?? 'Failed to update password.', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
