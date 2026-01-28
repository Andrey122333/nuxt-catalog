export default defineNuxtConfig({
  devtools: { enabled: true },
  
  devServer: {
    port: 3012,
    host: '0.0.0.0'
  },
  
  app: {
    head: {
      title: 'Код и Кофе — Интернет-магазин для разработчиков',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Интернет-магазин товаров для разработчиков' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true
  },

  nitro: {
    preset: 'node-server'
  },

  compatibilityDate: '2024-01-01'
});
