<template>
    <UFooter
        :ui="{
            root: 'border-t border-neutral-200',
        }"
    >
        <template #left>
            <p class="text-muted text-sm">© {{ new Date().getFullYear() }} GShop. 保留所有權利。</p>
        </template>
    </UFooter>
</template>
