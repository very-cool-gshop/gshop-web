<template>
    <UCard class="w-full max-w-sm mb-5">
        <template #header>
            <div class="flex flex-col items-center gap-1 py-2">
                <p class="text-2xl font-bold text-highlighted">Sign in</p>
                <p class="text-sm text-muted">Welcome back</p>
            </div>
        </template>

        <UForm :state="state" class="flex flex-col gap-4" @submit="onSubmit">
            <UFormField label="Email" name="email">
                <UInput v-model="state.email" type="email" placeholder="you@example.com" autocomplete="email" class="w-full" />
            </UFormField>

            <UFormField label="Password" name="password">
                <UInput v-model="state.password" type="password" placeholder="••••••••" autocomplete="current-password" class="w-full" />
            </UFormField>

            <UButton type="submit" class="w-full justify-center mt-4 cursor-pointer" :loading="loading">Sign in</UButton>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const toast = useToast()
const { login } = useAuth()

const state = reactive({ email: '', password: '' })
const loading = ref(false)

async function onSubmit() {
    loading.value = true
    try {
        await login(state.email, state.password)
        toast.add({ title: 'Signed in', color: 'success' })
        await navigateTo('/')
    } catch (error: any) {
        const message = error?.data?.message ?? 'Login failed'
        toast.add({ title: 'Login failed', description: message, color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
