<script setup lang="ts">
import type { NuxtError } from '#app'

import * as locales from '@nuxt/ui/locale'

const props = defineProps<{
    error: NuxtError
}>()

const { shopify: { shopName } } = useAppConfig()
const { id, init, get } = useCart()

useHead({
    htmlAttrs: {
        lang: 'en',
        dir: 'ltr',
    },
    title: shopName,
})

watch(id, value => !value ? init().then(get) : get(), { immediate: true })
</script>

<template>
    <UApp :locale="locales.en">
        <NuxtLayout>
            <UError
                :error="props.error"
                :clear="false"
            >
                <template #links>
                    <UButton
                        @click="clearError({ redirect: '/' })"
                    >
                        Back to Homepage
                    </UButton>
                </template>
            </UError>
        </NuxtLayout>
    </UApp>
</template>
