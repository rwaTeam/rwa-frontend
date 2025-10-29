// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@pinia/nuxt',
    // '@nuxt/eslint'
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  },
  components: [
    {
      path: '~/app/components',
      pathPrefix: false,
      // 忽略 ui 目錄下的 index.ts 檔案以避免命名衝突
      ignore: ['**/ui/**/index.ts']
    }
  ]
})