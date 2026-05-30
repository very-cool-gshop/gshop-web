// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/shopify',
        '@nuxtjs/critters',
        '@nuxt/image',
        '@nuxt/ui',
    ],

    css: ['~/assets/main.css'],

    ui: {
        colorMode: false,
    },

    runtimeConfig: {
        public: {
            apiBase: '',
        },

        shopify: {
            name: 'nuxt-shopify-demo-store',

            clients: {
                storefront: {
                    mock: true,
                    apiVersion: '2026-01',
                },
            },
        },
    },

    routeRules: {
        '/': { prerender: true },
        '/blog/**': { isr: 3600 },
    },

    devServer: {
        port: 3003,
    },

    compatibilityDate: '2026-03-15',

    vite: {
        server: {
            allowedHosts: [
                '.vercel.app',
            ],
        },
    },

    fonts: {
        families: [
            {
                name: 'Source Sans 3',
                provider: 'google',
            },
        ],
    },

    image: {
        provider: 'shopify',
    },
})
