<template>
    <UHeader title="Nuxt Shopify">
        <template #left>
            <Logo />
        </template>

        <UNavigationMenu :items="items" />

        <template #body>
            <UNavigationMenu :items="items" orientation="vertical" />
        </template>

        <template #right>
            <SearchModal />

            <NuxtLink v-if="isLoggedIn" to="/user">
                <UButton icon="i-lucide-user" variant="ghost" color="neutral" aria-label="Account" :ui="{ base: 'px-1.5 lg:px-2' }" />
            </NuxtLink>
            <NuxtLink v-else to="/login">
                <UButton icon="i-lucide-user" variant="ghost" color="neutral" aria-label="Sign in" :ui="{ base: 'px-1.5 lg:px-2' }" />
            </NuxtLink>

            <CartModal />
        </template>
    </UHeader>
</template>

<script setup lang="ts">
const apiFetch = useApiFetch()
const { isLoggedIn } = useAuth()
const { data: categories } = await useAsyncData('categories', () =>
    apiFetch<{ id: number; name: string }[]>('/categories'),
)

const items = computed(() => categories.value?.map((c) => ({ label: c.name, to: `/category/${c.id}` })) ?? [])
</script>
