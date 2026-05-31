import type { User } from '~/api/auth'

export default defineNuxtPlugin(async () => {
    const token = useCookie('token')
    const user = useState<User | null>('auth:user')

    if (token.value && !user.value) {
        const {
            public: { apiBase },
        } = useRuntimeConfig()

        try {
            user.value = await $fetch<User>(`${apiBase}/auth/me`, {
                headers: { Authorization: `Bearer ${token.value}` },
            })
        } catch {
            token.value = null
        }
    }
})
