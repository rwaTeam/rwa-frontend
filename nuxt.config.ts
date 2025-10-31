// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;800&display=swap' }
      ]
    }
  },
  vite: {
    optimizeDeps: {
      include: ['ethers']
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  },
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