<script setup lang="ts">
import type { ApiCartItem } from '~/composables/useApiCart'
import { z } from 'zod'

const props = defineProps<{
    item: ApiCartItem
}>()

const { updateItem, removeItem } = useApiCart()

const variant = computed(() => props.item.ProductVariant)
const product = computed(() => variant.value.Product)

const schema = z.object({
    quantity: z.number().min(1).max(10),
})

const state = reactive<z.infer<typeof schema>>({
    quantity: props.item.quantity,
})

watch(
    () => state.quantity,
    (q) => updateItem(props.item.id, q),
)
</script>

<template>
    <UCard :ui="{ body: 'relative flex justify-between gap-8' }">
        <NuxtImg
            v-if="product.image?.url"
            :src="product.image.url"
            :alt="product.name"
            width="160"
            height="160"
            class="size-24 lg:size-28 object-cover"
        />
        <div v-else class="size-24 lg:size-28 bg-gray-100 rounded" />

        <div class="h-24 flex flex-col justify-between grow lg:h-28">
            <p class="pt-2.5 font-medium">{{ product.name }}<span v-if="variant.name"> - {{ variant.name }}</span></p>

            <div class="flex justify-between gap-4">
                <UForm :state="state" :schema="schema" :validate-on="['change']">
                    <UFormField name="quantity">
                        <UInputNumber v-model="state.quantity" :min="1" :max="10" class="w-24" />
                    </UFormField>
                </UForm>

                <p class="font-semibold leading-8">
                    {{ (Number(variant.price) * item.quantity).toFixed(2) }}
                </p>
            </div>
        </div>

        <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-x"
            size="sm"
            class="absolute top-0 right-0 p-2 rounded-none rounded-bl-md"
            @click="removeItem(item.id)"
        />
    </UCard>
</template>
