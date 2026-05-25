<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types'

const items = computed<NavigationMenuItem[]>(() => [
    {
        to: 'https://github.com/nuxt-modules/shopify',
        label: 'Github',
    },
    {
        to: 'https://nuxt.com/modules/shopify',
        label: 'Module Page',
    },
    {
        to: 'https://shopify.nuxtjs.org',
        label: 'Documentation',
    },
    {
        to: 'https://npmx.dev/package/@nuxtjs/shopify',
        label: 'NPM Package',
    },
].map(item => ({
    ...item,
    target: '_blank',
    icon: 'i-lucide-minus',
})))
</script>

<template>
    <UFooter
        :ui="{
            root: 'border-t border-neutral-200',
            top: 'pb-0 lg:pb-0',
        }"
    >
        <template #top>
            <UContainer class="flex flex-col sm:flex-row sm:items-end">
                <Version />

                <span class="hidden mx-4 mb-2 h-6 w-px bg-neutral-200 sm:block sm:mb-4 sm:mx-6" />

                <UNavigationMenu
                    :items="items"
                    :ui="{
                        root: 'sm:-mb-1 md:mb-1',
                        list: 'flex items-start flex-col sm:flex-row',
                        item: 'py-1 sm:py-2',
                        linkLeadingIcon: 'sm:hidden',
                        linkLabelExternalIcon: 'hidden',
                    }"
                />
            </UContainer>
        </template>

        <template #left>
            <p class="text-muted text-sm">
                Published under the MIT License.
            </p>
        </template>

        <template #right>
            <UNavigationMenu
                orientation="horizontal"
                :items="[
                    {
                        icon: 'i-lucide-github',
                        to: 'https://github.com/nuxt-modules/shopify/tree/main/template',
                        label: 'View on GitHub',
                        target: '_blank',
                    },
                ]"
                :ui="{
                    linkLabelExternalIcon: 'hidden',
                }"
            />
        </template>
    </UFooter>
</template>
