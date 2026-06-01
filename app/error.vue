<script setup lang="ts">
import type { NuxtError } from '#app'

import * as locales from '@nuxt/ui/locale'

const props = defineProps<{
    error: NuxtError
}>()

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
            <UError :error="props.error" :clear="false">
                <template #links>
                    <UButton @click="clearError({ redirect: '/' })"> Back to Homepage </UButton>
                </template>
            </UError>
        </NuxtLayout>
    </UApp>
</template>
