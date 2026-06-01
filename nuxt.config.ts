// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
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
})
