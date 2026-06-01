<script setup lang="ts">
const isHovered = ref(false)
</script>

<template>
    <NuxtLink to="/" class="flex items-center gap-1.5 mr-4 shrink-0 select-none group">
        <span
            class="text-xl text-gray-900 transition-colors duration-200"
            style="font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: -0.02em;"
            :style="{ color: isHovered ? '#00C951' : '' }"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
        >GShop</span>
    </NuxtLink>
</template>
