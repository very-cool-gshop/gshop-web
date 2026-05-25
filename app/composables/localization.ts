export const useLocalization = () => {
    const language = ref('en')
    const country = ref('us')

    return {
        language,
        country,
        getLanguage: () => 'en',
        getCountry: () => 'us',
    }
}
