<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

useHead({
    htmlAttrs: {
        lang: 'en',
        dir: 'ltr',
    },
    title: 'GShop',
})
</script>

<template>
    <UApp :locale="locales.en">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
