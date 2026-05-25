<script setup lang="ts">
const { language, country } = useLocalization()

const query = ref('')
const open = ref(false)

const { data, status } = await useStorefrontData(
    `search-${query.value ?? 'none'}`,
    `#graphql
    query predictiveSearch($query: String!, $first: Int, $language: LanguageCode, $country: CountryCode)
    @inContext(language: $language, country: $country) {
        predictiveSearch(query: $query) {
            queries {
                text
            }
        }
        products(first: $first, query: $query) {
            edges {
                node {
                    handle
                    title
                    description
                    featuredImage {
                        ...ImageFields
                    }
                }
            }
        }
        collections(first: $first, query: $query) {
            edges {
                node {
                    handle
                    title
                    description
                }
            }
        }
        articles(first: $first, query: $query) {
            edges {
                node {
                    handle
                    title
                    excerpt
                    blog {
                        handle
                    }
                }
            }
        }
    }
    ${IMAGE_FRAGMENT}
`,
    {
        variables: computed(() =>
            predictiveSearchParamsSchema.extend(localizationParamsSchema.shape).parse({
                query: query.value,
                language: language.value,
                country: country.value,
            }),
        ),
        watch: [query],
        lazy: true,
    },
)

const groups = computed(() => [
    {
        id: 'queries',
        label: 'Search for',
        items: data.value?.predictiveSearch?.queries.map((predictedQuery) => ({
            label: predictedQuery.text,
            onSelect: () => (query.value = predictedQuery.text),
        })),
    },
    {
        id: 'products',
        label: 'Products',
        items: flattenConnection(data.value?.products).map((product) => ({
            label: product.title,
            suffix: product.description,
            to: `/product/${product.handle}`,
            avatar: {
                src: `${product.featuredImage?.url}?width=40&height=40`,
                alt: product.featuredImage?.altText,
            },
            onSelect: () => (open.value = false),
        })),
    },
    {
        id: 'collections',
        label: 'Collections',
        items: flattenConnection(data.value?.collections).map((collection) => ({
            label: collection.title,
            suffix: collection.description,
            to: `/collection/${collection.handle}`,
            onSelect: () => (open.value = false),
        })),
    },
    {
        id: 'articles',
        label: 'Articles',
        items: flattenConnection(data.value?.articles).map((article) => ({
            label: article.title,
            suffix: article.excerpt ?? undefined,
            to: `/blog/${article.blog.handle}/${article.handle}`,
            onSelect: () => (open.value = false),
        })),
    },
])

const updateQuery = debounce((value: string) => (query.value = value), 300)
</script>

<template>
    <UModal v-model:open="open" title="Search" description="Find products and collections">
        <UButton icon="i-lucide-search" variant="ghost" color="neutral" label="Search" />

        <template #content>
            <UCommandPalette
                :loading="status === 'pending'"
                placeholder="Search..."
                :groups="groups"
                :close="true"
                @update:search-term="updateQuery"
            />
        </template>
    </UModal>
</template>
