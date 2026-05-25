<script setup lang="ts">
definePageMeta({
    validate: (route) => typeof route.params.handle === 'string' && typeof route.params.article === 'string',
})

const {
    shopify: { shopName },
} = useAppConfig()
const route = useRoute()

const handle = computed(() => route.params.handle as string)
const article = computed(() => route.params.article as string)

const { data: blog, error } = await useStorefrontData(
    `article-${handle.value}`,
    `#graphql
    query FetchBlogArticle($handle: String!, $article: String!) {
        blog(handle: $handle) {
            title
            articleByHandle(handle: $article) {
                ...ArticleFields
            }
        }
    }
    ${ARTICLE_FRAGMENT}
`,
    {
        variables: {
            handle: handle.value,
            article: article.value,
        },
        transform: (data) => data?.blog,
        cache: 'long',
    },
)

const articleData = computed(() => blog.value?.articleByHandle)

if (!articleData.value || error.value) {
    throw createError({
        status: 404,
        statusText: `Page not found: ${route.fullPath}`,
        message: error.value?.message || 'Article not found',
    })
}

useSeoMeta({
    title: `${articleData.value?.seo?.title ?? articleData.value?.title} | ${shopName}`,
    description:
        articleData.value?.seo?.description ??
        'Welcome to our demo store! Explore our collections and find the perfect items for you.',
})
</script>

<template>
    <UContainer class="py-6 lg:py-8">
        <UBreadcrumb
            :items="[
                { label: 'Blog' },
                { label: blog?.title, to: `/blog/${handle}` },
                { label: articleData?.title, to: `/blog/${handle}/${article}` },
            ]"
            class="mb-8"
        />

        <div class="prose lg:prose-lg max-w-none">
            <h1>
                {{ articleData?.title }}
            </h1>

            <div v-html="articleData?.contentHtml" />
        </div>
    </UContainer>
</template>
