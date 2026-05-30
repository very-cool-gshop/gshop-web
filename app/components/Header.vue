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
const items = [
    { label: 'Clothing', to: '/category/clothing' },
    { label: 'Men', to: '/collection/men' },
    { label: 'Women', to: '/collection/women' },
    { label: 'Unisex', to: '/collection/unisex' },
]
</script>
