<template>
    <div />
</template>

<script setup lang="ts">
const route = useRoute()
const apiFetch = useApiFetch()

const { data: product } = await useAsyncData(
    `product-${route.params.handle}`,
    () => apiFetch(`/products/${route.params.handle}`)
)

console.log('product', product.value)
</script>
