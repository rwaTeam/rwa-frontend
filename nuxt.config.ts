// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'GreenFi Labs - 農業 RWA 代幣化平台',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '透過區塊鏈技術將農業專案代幣化，讓投資人與農民建立透明、可信任的合作關係' },
        { name: 'keywords', content: 'RWA, 農業代幣化, 區塊鏈, 投資, NFT, DeFi, 永續農業' },
        { name: 'author', content: 'GreenFi Labs' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'GreenFi Labs - 農業 RWA 代幣化平台' },
        { property: 'og:description', content: '透過區塊鏈技術將農業專案代幣化，讓投資人與農民建立透明、可信任的合作關係' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'GreenFi Labs - 農業 RWA 代幣化平台' },
        { name: 'twitter:description', content: '透過區塊鏈技術將農業專案代幣化，讓投資人與農民建立透明、可信任的合作關係' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;800&display=swap' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'https://rwa-backend.vercel.app',
        changeOrigin: true,
      }
    }
  },
  routeRules: {
    '/api/**': {
      proxy: 'https://rwa-backend.vercel.app/api/**'
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