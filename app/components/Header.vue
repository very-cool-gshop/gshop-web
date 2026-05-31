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

            <CartModal />
        </template>
    </UHeader>
</template>

<script setup lang="ts">
const apiFetch = useApiFetch()
const { data: categories } = await useAsyncData('categories', () =>
    apiFetch<{ id: number; name: string }[]>('/categories'),
)

const items = computed(() => categories.value?.map((c) => ({ label: c.name, to: `/category/${c.id}` })) ?? [])
</script>
